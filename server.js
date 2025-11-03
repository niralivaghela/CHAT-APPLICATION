require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const { saveMessage, getMessages } = require("./server/controllers/chatController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static(path.join(__dirname, "client/public")));

let users = {};
let messageReactions = {};

io.on("connection", async (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Send previous chat history
  try {
    const messages = await getMessages();
    socket.emit("chatHistory", messages);
  } catch (error) {
    console.log("No previous messages");
    socket.emit("chatHistory", []);
  }

  socket.on("newUser", (userData) => {
    const user = typeof userData === 'string' ? { username: userData, avatar: '👤', status: 'Online' } : userData;
    users[socket.id] = user;
    io.emit("userJoined", user);
    console.log(`User joined: ${user.username}`);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("showTyping", users[socket.id]?.username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping", users[socket.id]?.username);
  });

  socket.on("chatMessage", async (messageData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      user: user.username,
      text: typeof messageData === 'string' ? messageData : messageData.text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date(),
      replyTo: messageData.replyTo || null
    };
    
    io.emit("message", message);
    
    try {
      await saveMessage(message);
    } catch (error) {
      console.log("Could not save message:", error.message);
    }
  });

  socket.on("fileMessage", async (fileData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      user: user.username,
      file: fileData,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date()
    };
    
    io.emit("fileMessage", message);
    
    try {
      await saveMessage(message);
    } catch (error) {
      console.log("Could not save message:", error.message);
    }
  });

  socket.on("voiceMessage", async (voiceData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      user: user.username,
      voice: voiceData,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date()
    };
    
    io.emit("voiceMessage", message);
    
    try {
      await saveMessage(message);
    } catch (error) {
      console.log("Could not save message:", error.message);
    }
  });

  socket.on("gifMessage", async (gifData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      user: user.username,
      gif: gifData,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date()
    };
    
    io.emit("gifMessage", message);
    
    try {
      await saveMessage(message);
    } catch (error) {
      console.log("Could not save message:", error.message);
    }
  });

  socket.on("messageReaction", (data) => {
    const { messageId, emoji, user } = data;
    
    if (!messageReactions[messageId]) {
      messageReactions[messageId] = {};
    }
    
    if (!messageReactions[messageId][emoji]) {
      messageReactions[messageId][emoji] = [];
    }
    
    const userIndex = messageReactions[messageId][emoji].indexOf(user);
    if (userIndex > -1) {
      messageReactions[messageId][emoji].splice(userIndex, 1);
      if (messageReactions[messageId][emoji].length === 0) {
        delete messageReactions[messageId][emoji];
      }
    } else {
      messageReactions[messageId][emoji].push(user);
    }
    
    io.emit("messageReaction", {
      messageId,
      reactions: messageReactions[messageId]
    });
  });

  socket.on("updateProfile", (profileData) => {
    if (users[socket.id]) {
      users[socket.id] = { ...users[socket.id], ...profileData };
      io.emit("userUpdated", users[socket.id]);
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.emit("userLeft", user);
      console.log(`User left: ${user.username}`);
    }
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));