import { api } from "../utils/api.js";


//auth api endpoints
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/register", userData),
  logout: () => api.post("/logout"),
  getUser: () => api.get("user"),
};


//tickets api endpoints
export const ticketsAPI = {
  getAll: () => api.get("/tickets"),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) =>
    api.post("/tickets", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
};

//comments api endpoints
export const commentsAPI = {
  create: (ticketId, data) => api.post(`/tickets/${ticketId}/comments`, data),
  delete: (ticketId, commentId) => api.delete(`/tickets/${ticketId}/comments/${commentId}`),
};


//chat api endpoints
export const chatAPI = {
  getMessages: (ticketId) => api.get(`/tickets/${ticketId}/chat`),
  sendMessage: (ticketId, message) =>
    api.post(`/tickets/${ticketId}/chat`, { message }),
  markAsRead: (ticketId) => api.post(`/tickets/${ticketId}/chat/mark-read`),
};




