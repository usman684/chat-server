import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

// ⚡ allow all for testing (production me frontend URL lagana)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (roomId) => {
    console.log("JOIN:", roomId);
    socket.join(roomId);
  });

  socket.on("send", (message) => {
    console.log("MSG:", message);

    // 🔥 IMPORTANT FIX (THIS WAS YOUR BUG)
    io.to(message.room).emit("message", message);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});