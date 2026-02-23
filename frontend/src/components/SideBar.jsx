// src/components/SideBar.jsx
import React, { useEffect, useState } from "react";
import { getSocket } from "../socket";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";

export default function SideBar({ selectedUser, setSelectedUser, currentUser }) {
  const [allConversations, setAllConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const socket = getSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("sidebar", currentUser._id);
      socket.on("conversation", (data) => {
        setAllConversations(data);
      });
    }
  }, [socket, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/user/searchUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: val }),
        });
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.users.filter(u => u._id !== currentUser?._id));
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="avatar">{currentUser?.name?.charAt(0)}</div>
          <h3>{currentUser?.name || "User"}</h3>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search or start new chat"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="conversation-list">
        {searchTerm ? (
          searchResults.map((user) => (
            <div
              key={user._id}
              className={`conv-item ${selectedUser?._id === user._id ? "active" : ""}`}
              onClick={() => {
                setSelectedUser(user);
                setSearchTerm("");
                setSearchResults([]);
              }}
            >
              <div className="avatar">{user.name.charAt(0)}</div>
              <div className="details">
                <span className="name">{user.name}</span>
              </div>
            </div>
          ))
        ) : (
          allConversations.map((conv) => (
            <div
              key={conv._id}
              className={`conv-item ${selectedUser?._id === conv.userDetails?._id ? "active" : ""}`}
              onClick={() => setSelectedUser(conv.userDetails)}
            >
              <div className="avatar">{conv.userDetails?.name?.charAt(0)}</div>
              <div className="details">
                <span className="name">{conv.userDetails?.name}</span>
                <p className="last-msg">{conv.lastMsg?.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
