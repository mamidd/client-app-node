const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log(`New user connected`);


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin',`Welcome to room ${params.room}!`));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined!`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message', message);
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
    }

    callback('Message sent to all users.');
  });

  socket.on('createLocationMessage', (coords, callback) => {
    console.log('Create Location Message', coords);
    let user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

    callback('Location sent to all users.');
  });

  socket.on('disconnect', () => {
    console.log(`User was disconnected`);
    let user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left!`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.app = app;