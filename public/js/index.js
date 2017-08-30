var socket = io();

socket.on('connect', function () {
    console.log('connected');
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

socket.on('newEmail', function (email) {
    console.log('New Email', email)
});