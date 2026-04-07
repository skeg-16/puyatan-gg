const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// 1. HTTP CORS Setup (Para sa regular requests)
app.use(cors({
  origin: ["https://puyatan-gg.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);

// 2. Socket.io CORS Setup (Dito tayo nagka-error kanina)
const io = new Server(server, {
  cors: {
    origin: ["https://puyatan-gg.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let waitingUsers = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("find_match", (userData) => {
    socket.userData = userData; 
    
    if (waitingUsers.length > 0) {
      // Humanap ng match based sa Univ, Tags, o Mood
      let matchIndex = waitingUsers.findIndex(u => 
        u.userData.univ === userData.univ || 
        u.userData.tags.some(tag => userData.tags.includes(tag)) ||
        u.userData.mood === userData.mood
      );

      // Kung walang exact match, kunin yung pinakaunang naghihintay
      if (matchIndex === -1) matchIndex = 0; 

      const kaMatch = waitingUsers.splice(matchIndex, 1)[0];
      const roomID = `room_${socket.id}_${kaMatch.id}`;
      
      socket.join(roomID); 
      kaMatch.join(roomID);

      // Sabihan ang dalawa na may match na
      io.to(roomID).emit("match_found", { room: roomID });
      
      // Palitan ng info
      socket.emit("stranger_info", kaMatch.userData);
      kaMatch.emit("stranger_info", socket.userData);

      socket.room = roomID; 
      kaMatch.room = roomID;
      
      console.log(`Match Found! Room: ${roomID}`);
    } else {
      waitingUsers.push(socket);
      socket.emit("waiting_for_match");
      console.log(`User ${socket.id} is waiting for match...`);
    }
  });

  // Chat logic
  socket.on("send_message", (data) => socket.to(data.room).emit("receive_message", data));
  socket.on("typing", () => socket.to(socket.room).emit("stranger_typing"));
  socket.on("send_reaction", (data) => socket.to(data.room).emit("receive_reaction", data));
  socket.on("set_afk", (isAfk) => socket.to(socket.room).emit("stranger_afk", isAfk));
  
  socket.on("submit_rating", (data) => {
    console.log(`[RATING] User rated last stranger: ${data.rating}`);
  });

  socket.on("report_user", (data) => {
    socket.to(data.room).emit("stranger_disconnected");
    socket.leave(data.room);
  });

  socket.on("disconnect", () => {
    waitingUsers = waitingUsers.filter(u => u.id !== socket.id);
    if (socket.room) {
      socket.to(socket.room).emit("stranger_disconnected");
    }
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// 3. Port Configuration for Render
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`PUYATAN.GG SERVER RUNNING ON PORT ${PORT} 🚀`));