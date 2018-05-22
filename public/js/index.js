var socket = io();

socket.on('connect', function() {
    console.log('Connected to the server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function(message) {
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a'),
        text: message.text
    });
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a'),
        url: message.url
    });
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = jQuery('#message');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {        
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function()     {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }),
        function() {
            locationButton.removeAttr('disabled');
            alert('Unable to fetch location.')        
        };    
    });
});