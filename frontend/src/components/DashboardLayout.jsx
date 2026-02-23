// src/components/DashboardLayout.jsx
import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import "./DashboardLayout.css";
import { connectSocket } from "../socket";

export default function DashboardLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (token) {
      connectSocket(token);
    }
  }, []);

  return (
    <div className="dashboard">
      <SideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser} currentUser={user} />
      {selectedUser ? (
        <ChatWindow selectedUser={selectedUser} currentUser={user} />
      ) : (
        <div className="empty-chat">
          <h2>Welcome to WhatsApp</h2>
          <p>Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
}
