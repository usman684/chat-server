import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);

// 🔥 IMPORTANT: Replace frontend URL after deploy
const FRONTEND_URL = "https://chat-client-kappa-mocha.vercel.app/";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("send", (message) => {
    console.log(message);
    socket.to(message.room).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔥 IMPORTANT: Production port fix
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});