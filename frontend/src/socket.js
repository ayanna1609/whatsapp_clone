import { io } from "socket.io-client";
import { API_URL } from "./utils/api";

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(API_URL, {
      auth: {
        token: token, // ✅ pass token
      },
      withCredentials: true,
    });
  }
};

export const getSocket = () => socket;
