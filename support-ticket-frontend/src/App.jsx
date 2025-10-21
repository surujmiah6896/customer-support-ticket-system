// src/App.js - Add this useEffect for Pusher cleanup
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";




function App() {
  return (
    <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
              </Routes>
            </main>
          </div>
        </Router>
    </AuthProvider>
  );
}

export default App;
