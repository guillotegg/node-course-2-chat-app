var socket = io();

function scrollToBottom() {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }

}

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } 
    })
});

socket.on('updateUserList', (users) => {
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function(message, socketId) {
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a'),
        text: message.text
    });

    if (!document.hasFocus() && socketId!==socket.id && message.from !== 'Admin') {
        notifyNewMessage(message.from, message.text);
    }

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a'),
        url: message.url
    });    
    
    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextbox = jQuery('#message');

    socket.emit('createMessage', {
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

function notifyNewMessage(userName, message) {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
        window.name = 'test';
        var notification = new Notification(`New message from ${userName}:`, {
        icon: './../images/notificacion.png',
        body: message
      });
      setTimeout(notification.close.bind(notification), 5000);      
    }
}