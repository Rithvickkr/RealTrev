import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

// CORS Configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json()); // Middleware for JSON parsing

// Routes for basic testing
app.get("/", (req, res) => {
  res.send("Socket.IO server is running.");
});

// Socket.IO Event Listeners
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific room
  socket.on("joinRoom", ({ queryid }) => {
    if (!queryid) {
      console.error("Query ID missing!");
      return;
    }
    socket.join(queryid);  // Ensure that we're joining the room with the queryid
    console.log(`User joined room: ${queryid}`);
  });

  // Handle messages in a room
  socket.on("sendMessage", ({ id, senderId, message }) => {
    if (!id || !message) return console.error("Invalid message payload!");

    io.to(id).emit("receiveMessage", message); // Broadcast the message to the room
    console.log(`Message sent in room ${id}: ${message} by ${senderId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Server Listener
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
