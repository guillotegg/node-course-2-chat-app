const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Starting on port ${port}`);
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })

    socket.emit('newMessage', { from: 'pepe@hotmail.com', text: 'asasasasasasas', createdAt: '123'  });

    socket.on('createMessage', (data) => {
        console.log('create message from client', data)
    });
});

module.exports = {app};