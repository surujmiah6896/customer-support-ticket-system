
import api from '../utils/api'

//auth api endpoints
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/register", userData),
  logout: () => api.post("/logout"),
  getUser: () => api.get("/user"),
  getCustomers: () => api.get("/customers"),
};


//tickets api endpoints
export const ticketsAPI = {
  getAll: () => api.get("/tickets"),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => {
    const config =
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/tickets", data, config);
  },
  update: (id, data) => {
    const config =
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post(`/tickets/${id}`, data, config);
  },
  delete: (id) => api.delete(`/tickets/${id}`),
};

//comments api endpoints
export const commentsAPI = {
  create: (ticketId, data) => api.post(`/tickets/${ticketId}/comments`, data),
  delete: (ticketId, commentId) => api.delete(`/tickets/${ticketId}/comments/${commentId}`),
};


//chat api endpoints
export const chatAPI = {
  getMessages: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/chat`);

    console.log("Get messages response:", response.data);

     let messages = [];

    if (
      response.data &&
      response.data.status &&
      Array.isArray(response.data.messages)
    ) {
      messages = response.data.messages;
    } else if (response.data && Array.isArray(response.data)) {
      messages = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      messages = response.data.data;
    }

    console.log("Extracted messages:", messages);

    // Ensure each message has a user object
    const messagesWithUsers = messages.map((message) => ({
      ...message,
      user: message.user || {
        id: message.user_id,
        name: "Unknown User",
        role: "user",
      },
    }));

    return { ...response, data: messagesWithUsers };
  },

  sendMessage: async (ticketId, messageText) => {
    const response = await api.post(`/tickets/${ticketId}/chat`, {
      message: messageText,
    });

    console.log("Send message full response:", response.data);
    
    let chatMessage = null;

    if (response.data && response.data.chatMessage) {
      chatMessage = response.data.chatMessage;
    } else if (response.data && response.data.data) {
      chatMessage = response.data.data;
    } else {
      chatMessage = response.data;
    }

    console.log("Extracted chatMessage:", chatMessage);

    // Ensure the message has user data
    if (chatMessage && !chatMessage.user) {
      chatMessage.user = {
        id: chatMessage.user_id,
        name: "Unknown User",
        role: "user",
      };
    }

    return { ...response, data: chatMessage };
  },
  markAsRead: (ticketId) => api.post(`/tickets/${ticketId}/chat/mark-read`),
};




