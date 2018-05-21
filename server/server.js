const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
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

    socket.emit('newMessage', generateMessage('Admin', 'Wellcome to the chatroom!'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User has joined the chatroom!'));

    socket.on('createMessage', (data) => {
        console.log('create message from client', data)

        io.emit('newMessage', generateMessage(data.from, data.text));
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
});

module.exports = {app};