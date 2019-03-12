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
  let lastMessageHeight = newMessage.prev().innerHeight();
  let newMessageHeight = newMessage.innerHeight();

  /*
  clientHeight è come se fosse l'altezza della barra grigio scuro nel browser
  scrollTop è lo spazion tra il top della pagina e l'inizio della barra grigio scuro del browser
  scrollHeight è la dimensione di tutta la barra di scorrimento

  devo scrollare solo se sono perfettamente in basso nella barra di scroll del browser e
  per capirlo faccio la somma in basso
  considero anche il lastMessagePrev perchè altrimenti se io fossi a metà dell'ultimo messaggio
  la barra non scorrerebbe più in basso e rischio di perdermi altri messaggi
  io scrollo quindi se sono a metà dell'attuale ultimo messaggio
  altrimenti se fossi anche un solo pixel prima della fine del container, non scrollerebbe

  RIASSUNTO
  in poche parole il lastMessageHeight è il numero massimo di pixel calcolati dal basso
  superati i quali non scrollo più
  */
  if(scrollTop + clientHeight + lastMessageHeight + newMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }

  console.log('clientHeight', clientHeight)
  console.log('scrollTop', scrollTop)
  console.log('scrollHeight', scrollHeight)
  console.log('newMessageHeight', newMessageHeight)
  console.log('lastMessageHeight', lastMessageHeight)
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
