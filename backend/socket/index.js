// socket/index.js
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("../routes/userRoutes");
const getUserByToken = require("../utils/getUserByToken");
const ConversationModel = require("../models/conversationModel");
const messageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const getConversation = require("../utils/getConversation");

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ERROR HANDLING MIDDLEWARE
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.error(`Status: ${err.statusCode}, Error: ${err.message}`);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// ROUTES
app.use("/api/user", router);

// SIMPLE ROOT ROUTE
app.get("/", (req, res) => res.send("API is running"));

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

const onlineUsers = new Set();

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const user = await getUserByToken(token);
    if (!user) return next(new Error("Invalid token"));
    socket.user = user;
    next();
  } catch (err) {
    console.log("Socket auth error:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  const user = socket.user;
  console.log("User connected:", user._id);

  socket.join(user._id.toString());
  onlineUsers.add(user._id.toString());
  io.emit("onlineUser", Array.from(onlineUsers));

  socket.on("messagePage", async (userId) => {
    try {
      const userDetails = await UserModel.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profilePic: userDetails?.profilePic,
        online: onlineUsers.has(userId),
      };

      socket.emit("message-user", payload);

      const conversation = await ConversationModel.findOne({
        $or: [
          { sender: user._id, receiver: userId },
          { sender: userId, receiver: user._id },
        ],
      }).populate("messages");

      socket.emit("message", conversation?.messages || []);
    } catch (error) {
      console.error("Error in messagePage:", error);
    }
  });

  socket.on("newMessage", async (data) => {
    try {
      const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = data;

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: sender, receiver: receiver },
          { sender: receiver, receiver: sender },
        ],
      });

      if (!conversation) {
        conversation = await ConversationModel.create({
          sender: sender,
          receiver: receiver,
        });
      }

      const message = await messageModel.create({
        text,
        imageUrl,
        videoUrl,
        msgByUser: msgByUserId || sender,
      });

      await ConversationModel.updateOne(
        { _id: conversation._id },
        {
          $push: { messages: message._id },
        }
      );

      const updatedConversation = await ConversationModel.findById(conversation._id).populate("messages");

      io.to(sender).to(receiver).emit("message", updatedConversation.messages);

      // Update conversations list for both users
      const senderConversations = await getConversation(sender);
      const receiverConversations = await getConversation(receiver);

      io.to(sender).emit("conversation", senderConversations);
      io.to(receiver).emit("conversation", receiverConversations);

    } catch (error) {
      console.error("Error in newMessage:", error);
    }
  });

  socket.on("sidebar", async (userId) => {
    try {
      const conversation = await getConversation(userId);
      socket.emit("conversation", conversation);
    } catch (error) {
      console.error("Error in sidebar socket handler:", error);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    io.emit("onlineUser", Array.from(onlineUsers));
    console.log("User disconnected:", user._id);
  });
});

app.use(errorMiddleware);

module.exports = { server };
