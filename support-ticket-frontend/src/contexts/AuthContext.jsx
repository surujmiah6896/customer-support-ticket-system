
import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/APIService";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("must be used within an AuthProvider");
    }
    return context;
}


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        authAPI
          .getUser()
          .then((response) => {
            console.log("Auth response:", response.data);
            if (response.data && response.data.user) {
              setUser(response.data.user); 
            } else {
              setUser(response.data); 
            }
          })
          .catch(() => {
            localStorage.removeItem("token");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, []);

    const login = async (credentials) =>{
        const res = await authAPI.login(credentials);
        const {user, token} = res.data;

        localStorage.setItem('token', token);
        setUser(user);
        return res;
    }

    const register = async(userData) =>{
        const res = await authAPI.register(userData);
        const {user, token} = res.data;

        localStorage.setItem("token", token);
        setUser(user);
        return res;
    }

    const logout = async () => {
      await authAPI.logout();
      localStorage.removeItem("token");
      setUser(null);
    };

    const value = {
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}