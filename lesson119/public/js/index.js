let socket = io();

function formatTime(time) {
  return moment(time).format('h:mm a');
}

function renderMessage(templateName, templateParameters){
  let template = jQuery(templateName).html();
  let html = Mustache.render(template, templateParameters);

  jQuery('#messages').append(html);
  scrollToBottom();
}

function scrollToBottom () {
  // Selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child');
  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function (){
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message){
  console.log('Got New Message. ', message);

  renderMessage('#message-template', {
    text: message.text,
    from: message.from,
    createdAt: formatTime(message.createdAt)
  });
});

socket.on('newLocationMessage', function (message){
  console.log('Got New Location Message. ', message);

  renderMessage('#location-message-template', {
    url: message.url,
    from: message.from,
    createdAt: formatTime(message.createdAt)
  });
});

let messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e){
  let _this = this;
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function (data) {
    console.log('Got it. ', data);
    messageTextBox.val('')
  })
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', true).text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function (data) {
      console.log(data);
      locationButton.attr('disabled', false).text('Send location');
    })

  }, function () {
    alert('Unable to fetch location.');
    locationButton.attr('disabled', false).text('Send location');
  });
});
