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

    socket.emit('newMessage', { from: 'Admin', text: 'Wellcome to the chatroom!', createdDat: new Date().getTime() } );
    socket.broadcast.emit('newMessage', { from: 'Admin', text: 'New User has joined the chatroom!', createdDat: new Date().getTime() });

    socket.on('createMessage', (data) => {
        console.log('create message from client', data)

        io.emit('newMessage', { from: data.from, text: data.text, createdAt: data.createdAt });
    });
});

module.exports = {app};