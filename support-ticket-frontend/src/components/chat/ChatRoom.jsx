
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../widgets/Button";
import { FaArrowCircleUp, FaMailBulk } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import pusherService from "../../services/PusherService";
import { chatAPI } from "../../services/APIService";
import { formatTime } from "../../utils/formatTime";


const ChatRoom = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [sending, setSending] = useState(false);
  const [connectionState, setConnectionState] = useState("disconnected");
  const messagesEndRef = useRef(null);
  const { user: authData } = useAuth();

    const getCurrentUser = () => {
    if (authData && authData.user) return authData.user;
    if (authData && authData.id) return authData;
    return null;
    };

    const currentUser = getCurrentUser();

    const getSafeUser = (message) => {
      if (!message){
          return { id: null, name: "Unknown User", role: "user" };
      } 
      if (message.user && typeof message.user === "object"){
          return message.user;
      } 
      if (message.user_id){
          return { id: message.user_id, name: "Unknown User", role: "user" };
      }
      return { id: null, name: "Unknown User", role: "user" };
    };

    const scrollToBottom = ()=>{
       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const isCurrentUserMessage = (message) => {
      if (!message || !currentUser) return false;
      const safeUser = getSafeUser(message);
      return Number(safeUser.id) === Number(currentUser.id);
    };

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionState(pusherService.getConnectionState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

   //load messages
   const getAllMessages = async()=>{
    setLoading(true);
    try {
        const response = await chatAPI.getMessages(ticketId);
        setMessages(response.data);
    } catch (error) {
        console.error("Error get messages:", error);
    }finally{
        setLoading(false);
    }
   } 

   //setup pusher
const setupPusher = useCallback(async () => {
  try {
    const unsubscribe = await pusherService.bindEvent(
      `ticket_${ticketId}`,
      "new.chat.message",
      (data) => {
        let messageData = data;
        if (data.chatMessage) {
          messageData = data.chatMessage;
        }

        const safeData = {
          ...messageData,
          user: getSafeUser(messageData),
        };

        setMessages((prev) => {
          const hasTempWithSameContent = prev.some(
            (msg) => msg.isTemp && msg.message === safeData.message
          );

          if (hasTempWithSameContent) {
            return prev;
          }

          const existsById = prev.some((msg) => msg.id === safeData.id);
          if (existsById) {
            return prev;
          }
          return [...prev, safeData];
        });

        if (!isCurrentUserMessage(safeData)) {
          markMessagesAsRead();
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.log('setup pusher error', error);
    
    return () => {};
  }
}, [ticketId, currentUser]);

   const markMessagesAsRead = async () => {
     try {
       await chatAPI.markAsRead(ticketId);
     } catch (error) {
       console.error("Error marking messages as read:", error);
     }
   };

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeChat = async () => {
      await getAllMessages();
      unsubscribe = await setupPusher();
    };

    initializeChat();

    return () => {
      unsubscribe();
      pusherService.unsubscribe(`ticket_${ticketId}`);
    };
  }, [setupPusher, ticketId]);


   const sendMessage = async (e) => {
     e.preventDefault();
     if (!newMessage.trim()) return;

     
     setSending(true);
     try {
       const safeUserData = {
         id: currentUser?.id || null,
         name: currentUser?.name || "You",
         role: currentUser?.role || "user",
       };

       const tempMessage = {
         id: `temp-${Date.now()}`,
         message: newMessage,
         user: safeUserData,
         ticket_id: parseInt(ticketId),
         created_at: new Date().toISOString(),
         is_read: false,
         isTemp: true,
       };

       setMessages((prev) => [...prev, tempMessage]);
       setNewMessage("");

       const response = await chatAPI.sendMessage(ticketId, newMessage);

       const chatMessage = response.data;
       const safeResponseData = {
         ...chatMessage,
         user: getSafeUser(chatMessage),
         isTemp: false,
       };

       setMessages((prev) =>
         prev.map((msg) => (msg.id === tempMessage.id ? safeResponseData : msg))
       );
     } catch (error) {
       console.error("Error sending message:", error);
       setMessages((prev) => prev.filter((msg) => !msg.isTemp));
     } finally {
       setSending(false);
     }
   };


  const renderMessage = (message) => {
    if (!message || !currentUser) return null;
    
    const isCurrentUser = isCurrentUserMessage(message);
    const safeUser = getSafeUser(message);

     

    return (
      <div
        key={message.id}
        className={`flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-400 text-white rounded-bl-none"
          } ${message.isTemp ? "opacity-70 animate-pulse" : ""}`}
        >
          {!isCurrentUser && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-white">
                {safeUser.name}
              </span>
              <span className="text-xs text-white">
                ({safeUser.role || "user"})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-1">
            {isCurrentUser && (
              <span className="text-xs font-medium text-blue-200">
                You ({currentUser.role || "user"})
              </span>
            )}

            <span
              className={`text-xs ${
                isCurrentUser ? "text-blue-300" : "text-white"
              }`}
            >
              {formatTime(message.created_at)}
              {message.isTemp && " (Sending...)"}
            </span>
          </div>
          <p className="text-sm break-words">{message.message}</p>
        </div>
      </div>
    );
  };


  return (
    <div className="bg-white shadow rounded-lg flex flex-col h-96">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Real-time Chat
            </h3>
            <p className="text-sm flex flex-col gap-2 items-start text-gray-500">
              <span>
                Chat with{" "}
                {currentUser?.role === "admin" ? "customer" : "support team"}
              </span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {messages.length} messages
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionState === "connected"
                  ? "bg-green-500"
                  : connectionState === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500 capitalize">
              {connectionState}
            </span>
          </div>
        </div>
      </div>

      {/* render message */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <div className="text-center flex flex-col items-center py-8">
            <FaMailBulk size={20} />
            <p className="text-gray-500">No messages!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
        <form
          onSubmit={sendMessage}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              currentUser?.role === "admin"
                ? "Type a message to customer..."
                : "Type your message to support..."
            }
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
            disabled={sending}
          />

          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            <FaArrowCircleUp className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
