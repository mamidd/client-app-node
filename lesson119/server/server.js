const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log(`New user connected`);

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!'))

  socket.broadcast.emit('newMessage',generateMessage('Admin','New User joined to chat app!'))

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message', message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback('Message sent to all users.');
  });

  socket.on('createLocationMessage', (coords, callback) => {
    console.log('Create Location Message', coords);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    callback('Location sent to all users.');
  });

  socket.on('disconnect', () => {
    console.log(`User was disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.app = app;
