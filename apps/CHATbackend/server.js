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
  socket.on("sendMessage", ({ queryid, senderId, message }) => {
    console.error(`Message received in room ${queryid}: ${message} by ${senderId}`);
    // Validate incoming payload
    if (!queryid || !senderId || !message) {
      console.error("Invalid message payload! Missing required fields.");
      return;
    }

    // Ensure message is a string
    if (typeof message !== "string") {
      console.error("Invalid message format! Expected a string.");
      return;
    }

    // Broadcast the message to the room
    io.to(queryid).emit("receiveMessage", { message, senderId });  // Broadcast the message to the room
    console.log(`Message sent in room ${queryid}: ${message} by ${senderId}`);
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
