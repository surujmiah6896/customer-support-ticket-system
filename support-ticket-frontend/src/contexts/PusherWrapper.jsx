import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import pusherService from "../services/PusherService";

export const PusherWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      pusherService.initialize();
    } else {
      pusherService.disconnect();
    }

    return () => {
      pusherService.disconnect();
    };
  }, [isAuthenticated]);

  return children;
};
