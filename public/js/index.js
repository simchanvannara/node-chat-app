var socket = io();

socket.on('connect', function () {
    console.log('connected');
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

socket.on('newMessage', function (message) {
    console.log('New Message', message)
    var formatTime = moment(message.createdAt).format('h:mm:a');
    var li = $('<li></li>');
    li.text(`${message.from} ${formatTime}: ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formatTime = moment(message.createdAt).format('h:mm:a');
    var li = $('<li></li>');
    var a =  $('<a target="_blank">My Location</a>');

    li.text(`${message.from} ${formatTime}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
});

$('#chat-message').submit(function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('#chat').val(),
        createdAt: moment.valueOf()
    }, function(message){
        $('#chat').val('')
    });
});

$('#send-location').on('click', function () {
    if (!navigator.geolocation) {
        return alert('not support');
    }
    $('#send-location').attr('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function (position) {
        $('#send-location').removeAttr('disabled').text('Sending location...');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        $('#send-location').removeAttr('disabled').text('Sending location...');
        alert('unable get location');
    });
});