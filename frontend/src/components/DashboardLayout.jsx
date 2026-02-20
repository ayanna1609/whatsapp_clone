// src/components/DashboardLayout.jsx
import React, { useEffect } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import "./DashboardLayout.css";
import { connectSocket } from "../socket";

export default function DashboardLayout() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      connectSocket(token); // ✅ Pass token here
    }
  }, []);

  return (
    <div className="dashboard">
      <SideBar />
      <ChatWindow />
    </div>
  );
}
