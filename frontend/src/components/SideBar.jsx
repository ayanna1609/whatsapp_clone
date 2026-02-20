// src/components/SideBar.jsx
import React from "react";
import "./SideBar.css";

export default function SideBar() {
  const users = ["Ayanna", "Ishu", "Alex", "Riya"];

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={index === 0 ? "active" : ""}>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}
