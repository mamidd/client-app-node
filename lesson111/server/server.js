const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log(`New user connected`);

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!'))

  socket.broadcast.emit('newMessage',generateMessage('Admin','New User joinded to chat app!'))

  socket.on('createMessage', (message) => {
    console.log('Create Message', message);
    io.emit('newMessage', generateMessage(message.from,message.text))
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createAt: new Date().getTime()
    // })
  });

  socket.on('disconnect', () => {
    console.log(`User was disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.app = app;
