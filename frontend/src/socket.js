// src/socket.js
import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        token: token, // ✅ pass token
      },
      withCredentials: true,
    });
  }
};

export const getSocket = () => socket;
