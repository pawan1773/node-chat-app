const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to ChatSpace'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Room are required');
        }
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // to emit to every user
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => console.log(`Server running on port ${port}.`));
