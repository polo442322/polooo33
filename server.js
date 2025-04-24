const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files
app.use(express.static(__dirname));

// Serve the game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'snake.html'));
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        const room = io.sockets.adapter.rooms.get(roomId);
        io.to(roomId).emit('player_count', room ? room.size : 0);
    });

    socket.on('game_update', (data) => {
        socket.to(data.roomId).emit('game_update', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 