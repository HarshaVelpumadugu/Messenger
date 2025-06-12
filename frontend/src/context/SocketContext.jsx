// src/context/SocketContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

// Create context
export const SocketContext = createContext();

// Custom hook to use socket context
export const useSocketContext = () => useContext(SocketContext);

// Context provider
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser?._id) {
      // Connect socket with backend URL
      const newSocket = io("https://messenger-backend-1-wfgx.onrender.com", {
        query: { userId: authUser._id },
        transports: ["websocket"], // Ensure WebSocket is used
        withCredentials: true,     // Helps with cookies if needed
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("🔌 Connected to socket server:", newSocket.id);
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
      });

      // Cleanup on unmount or logout
      return () => {
        newSocket.disconnect();
        setSocket(null);
        setOnlineUsers([]);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
