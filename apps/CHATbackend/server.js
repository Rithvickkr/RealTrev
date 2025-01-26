import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store active connections and their rooms
const clients = new Map();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});

wss.on("connection", (ws) => {
  const clientId = generateUniqueId();
  clients.set(ws, { id: clientId, rooms: new Set() });
  console.log(`User connected: ${clientId}`);

  ws.on("message", (data) => {
    try {
      const payload = JSON.parse(data);
      
      switch (payload.type) {
        case "joinRoom":
          handleJoinRoom(ws, payload);
          break;
        case "sendMessage":
          handleMessage(ws, payload);
          break;
        default:
          console.error("Unknown message type:", payload.type);
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  ws.on("close", () => {
    const client = clients.get(ws);
    console.log(`User disconnected: ${client.id}`);
    clients.delete(ws);
  });
});

function handleJoinRoom(ws, payload) {
  const { queryid } = payload;
  if (!queryid) {
    console.error("Query ID missing!");
    return;
  }
  
  const client = clients.get(ws);
  client.rooms.add(queryid);
  console.log(`User ${client.id} joined room: ${queryid}`);
}

function handleMessage(ws, payload) {
  const { queryid, senderId, message, time } = payload;
  
  if (!queryid || !senderId || !message) {
    console.error("Invalid message payload! Missing required fields.");
    return;
  }

  if (typeof message !== "string") {
    console.error("Invalid message format! Expected a string.");
    return;
  }

  // Broadcast to all clients in the same room
  clients.forEach((client, clientWs) => {
    if (client.rooms.has(queryid)) {
      const messageData = JSON.stringify({
        type: "receiveMessage",
        message,
        senderId,
        time
      });
      clientWs.send(messageData);
    }
  });

  console.log(`Message sent in room ${queryid}: ${message} by ${senderId} at ${time}`);
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
