import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Ensure you have CORS imported

const app = express();
const server = createServer(app);

// CORS configuration
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true, // Allow credentials if necessary
    },
});

// Basic middleware for parsing JSON
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/', (req, res) => {
    res.send('RealTrev Chat Backend is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinLocation', (location) => {
        socket.join(location);
        console.log(`${socket.id} joined ${location}`);
    });

    socket.on('sendMessage', ({ location, message }) => {
        console.log(`Message from ${socket.id} in ${location}: ${message}`);
        io.to(location).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
