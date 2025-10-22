
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
import { ProtectedRoute } from "./widgets/ProtectedRoute";



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
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <TicketList />
                  </ProtectedRoute>
                  } />
                <Route
                  path="/tickets/:id"
                  element={
                    <ProtectedRoute>
                      <TicketDetail />
                    </ProtectedRoute>
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
