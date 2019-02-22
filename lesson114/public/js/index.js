let socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function (){
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message){
  console.log('Got New Message. ', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message){
  console.log('Got New Location Message. ', message);
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My current location.</a>');
  a.attr('href', message.url);

  li.text(`${message.from}: `);
  li.append(a);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e){
  let _this = this;
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function (data) {
    console.log('Got it. ', data);
    _this.reset();
  })
});

let locationButton = jQuery('#send-location');

locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function (data) {
      console.log(data);
    })

  }, function () {
    alert('Unable to fetch location.');
  });
});
