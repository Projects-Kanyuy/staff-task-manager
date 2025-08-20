// backend/server.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const Message = require('./models/Message'); // Import the Message model for saving chats

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST"]
  }
});

// Use a Map to store online users: userId -> { socketId, name }
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  let connectedUserId = null; // Store the user ID for this specific socket connection

  // Authenticate the user when they connect via WebSocket
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      connectedUserId = decoded.user.id;
      // Store the user's socket ID and name for easy access
      onlineUsers.set(connectedUserId, {
          socketId: socket.id,
          name: decoded.user.name,
      });
      console.log(`User ${connectedUserId} (${decoded.user.name}) is now online.`);
    } catch (error) {
      console.log('Socket authentication error:', error.message);
      socket.disconnect(); // Disconnect if the token is invalid
    }
  }

  // Listen for 'sendMessage' events from any client
  socket.on('sendMessage', async (messageText) => {
      if (connectedUserId && onlineUsers.has(connectedUserId)) {
          const sender = onlineUsers.get(connectedUserId);
          
          // --- Logic to save the message to the database ---
          try {
              const message = new Message({
                  senderId: connectedUserId,
                  senderName: sender.name,
                  text: messageText,
              });
              const savedMessage = await message.save();
              
              // After successful save, broadcast the message to ALL connected clients
              // We send the saved message object which includes senderName, text, and timestamp
              io.emit('newMessage', {
                  senderId: savedMessage.senderId,
                  senderName: savedMessage.senderName,
                  text: savedMessage.text,
                  createdAt: savedMessage.createdAt,
              });
              
              console.log(`Saved and broadcasted message from ${sender.name}: ${messageText}`);
          } catch (error) {
              console.error('Failed to save chat message:', error);
              // Optionally, you could emit an error event back to the sender
              // socket.emit('messageError', 'Could not send message.');
          }
      }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    if (connectedUserId && onlineUsers.has(connectedUserId)) {
        onlineUsers.delete(connectedUserId);
        console.log(`User ${connectedUserId} went offline.`);
    }
  });
});

// Middleware to make the 'io' instance accessible in your controllers
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Standard Express Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory (if you use it)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/messages', require('./routes/messageRoutes')); // Route for chat history
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

// Start the server using the http instance, not the Express app
server.listen(PORT, () => console.log(`Server with real-time running on port ${PORT}`));