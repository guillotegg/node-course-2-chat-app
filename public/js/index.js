var socket = io();

socket.on('connect', function() {
    console.log('Connected to the server');
})

socket.on('disconnect', function() {
    console.log('Disconnected from the server');
})

socket.on('newMessage', function(data) {
    console.log('new message arrived', data);
    var li = jQuery('<li></li>');
    li.text(`${data.from}: ${data.text}`);
    jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('#message').val()
    }, function() {

    });
});