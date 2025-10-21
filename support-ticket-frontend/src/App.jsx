// src/App.js - Add this useEffect for Pusher cleanup
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { ToastContainer } from "react-toastify";
import TicketList from "./components/tickets/TicketList";
import Navbar from "./components/layout/Navbar";
import TicketDetail from "./components/tickets/TicketDetail";
import { PusherWrapper } from "./contexts/PusherWrapper";



function App() {
  return (
    <AuthProvider>
      <PusherWrapper>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer />
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<TicketList />} />
                <Route
                  path="/tickets/:id"
                  element={
                      <TicketDetail />
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </PusherWrapper>
    </AuthProvider>
  );
}

export default App;
