// backend/server.js

// Your existing imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// --- 1. ADD THESE IMPORTS ---
const http = require('http');
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
// ----------------------------

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// --- 2. CREATE HTTP SERVER & SOCKET.IO INSTANCE ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend to connect
    methods: ["GET", "POST"]
  }
});
// ----------------------------------------------------

// --- 3. ADD REAL-TIME LOGIC ---
let onlineUsers = new Map(); // Stores userId -> socketId

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);

  // Get token from the client's handshake
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user.id;
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} came online.`);
    } catch (error) {
      console.log('Socket authentication error:', error.message);
      socket.disconnect();
    }
  }

  socket.on('disconnect', () => {
    // Remove user from the map when they disconnect
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} went offline.`);
        break;
      }
    }
  });
});
// ------------------------------

// Your existing app.use() calls
app.use(cors());
app.use(express.json());

// --- 4. ADD MIDDLEWARE to make 'io' available in your routes ---
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});
// -----------------------------------------------------------------

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your existing routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;

// --- 5. CHANGE app.listen to server.listen ---
server.listen(PORT, () => console.log(`Server with real-time running on port ${PORT}`));
// -----------------------------------------------