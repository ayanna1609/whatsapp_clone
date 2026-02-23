import React, { useEffect, useState, useRef } from "react";
import { getSocket } from "../socket";
import "./ChatWindow.css";

export default function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [headerUser, setHeaderUser] = useState(selectedUser);
  const scrollRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.emit("messagePage", selectedUser._id);

    socket.on("message-user", (data) => {
      setHeaderUser(data);
    });

    socket.on("message", (allMessages) => {
      setMessages(allMessages);
    });

    return () => {
      socket.off("message-user");
      socket.off("message");
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const messageData = {
      sender: currentUser?._id,
      receiver: selectedUser?._id,
      text: input,
      msgByUserId: currentUser?._id,
      imageUrl: "",
      videoUrl: "",
    };

    socket.emit("newMessage", messageData);
    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{headerUser?.name?.charAt(0)}</div>
        <div className="header-info">
          <h3>{headerUser?.name}</h3>
          <p className={headerUser?.online ? "online" : "offline"}>
            {headerUser?.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="messages" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.msgByUser === currentUser?._id ? "sent" : "received"}`}
          >
            <p className="text">{msg.text}</p>
            <span className="time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="no-messages">Say hello to {headerUser?.name}!</div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!input.trim()}>Send</button>
      </div>
    </div>
  );
}
