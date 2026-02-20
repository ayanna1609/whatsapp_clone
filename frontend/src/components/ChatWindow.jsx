import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatWindow.css";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"), // Make sure token is stored here
  },
  withCredentials: true,
});

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const senderId = "6870b2d3e1ffc46fee213b85"; // Your ID
  const receiverId = "6870bd45196cc361a424d09b"; // Replace with actual receiver's user _id
  const msgByUserId = senderId; // Who is sending the message

  const handleSend = () => {
    if (!input.trim()) return;

    const messageData = {
      sender: senderId,
      receiver: receiverId,
      text: input,
      msgByUserId,
      imageUrl: "",   // Optional
      videoUrl: "",   // Optional
    };

    socket.emit("newMessage", messageData);
    setInput("");
  };

  useEffect(() => {
    socket.emit("messagePage", receiverId); // Load existing messages

    socket.on("message", (allMessages) => {
      setMessages(allMessages);
    });

    return () => {
      socket.off("message");
    };
  }, [receiverId]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.msgByUser === senderId ? "sent" : "received"}`}
          >
            <p className="text">{msg.text}</p>
            <span className="time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
