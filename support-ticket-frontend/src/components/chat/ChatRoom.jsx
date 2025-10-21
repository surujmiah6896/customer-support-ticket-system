
import { useState } from "react";
import { Button } from "../../widgets/Button";
import { FaArrowCircleUp } from "react-icons/fa";
import Badge from "../../widgets/Badge";

const userRole = false;
const ChatRoom = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [connectionState, setConnectionState] = useState("disconnected");


  const sendMessage = ()=>{
    console.log('send message');
    
  }
  return (
    <div className="bg-white shadow rounded-lg flex flex-col h-96">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Real-time Chat 
            </h3>
            <p className="text-sm text-gray-500">
              Chat with Role
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                30 messages
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

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              userRole
                ? "Type a message to customer..."
                : "Type your message to support..."
            }
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={sending}
          />
          <div>
          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}>
           <FaArrowCircleUp size={20}/> {sending ? "Sending..." : "Send"}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
