const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname + './../public');
const port = process.env.PORT || 3030;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user join'));

    socket.on('createMessage', (message, callback)=>{
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('this from server');
        // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });    
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})