const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const users = new Set();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    let username;

    socket.on('chat message', (message) => {
        // When message received, broadcast to all clients
        io.emit('chat message', message);
    });

    socket.on('user joined', (name) => {
        username = name;
        users.add(username);
        
        // Broadcast to all clients that a new user joined
        io.emit('user joined', username);
        
        // Send updated users list to ALL connected clients
        io.emit('users list', Array.from(users));
    });

    

    socket.on('disconnect', () => {
        if (username) {
            users.delete(username);
            io.emit('user left', username);
            // Send updated users list after user disconnects
            io.emit('users list', Array.from(users));
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});