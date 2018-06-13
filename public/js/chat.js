var socket = io();
var user = '';
var room = '';

function scrollToBottom(messages) {
    //selectors
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
    user = params.name;
    room =  params.room;
    
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } 
    })
});

socket.on('updateUserList', (users) => {
    var ol = jQuery('<ul></ul>');
    var name;
    var li;
    users.forEach(function(user) {
        li = jQuery('<li></li>');        
        if (user.id === socket.id) {            
            li.text(user.name + " (me)")            
        } else {
            li.text(user.name);
            li.dblclick(function() { openDirectChat(user.id, user.name) } );
        }                
        ol.append(li);        
    });
    jQuery('#users').html(ol);
});

socket.on('userDisconnected', (user) => {
    var popUpId = getPopUpId(user.name);
    close_popup(popUpId, true);    
})

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
        notifyNewMessage(message.from, message.text, false);
    }

    var messages = jQuery('#messages')
    messages.append(html);
    scrollToBottom(messages);
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a'),
        url: message.url
    });    
    
    var messages = jQuery('#messages')
    messages.append(html);
    scrollToBottom(messages);
});

socket.on('newDirectMessage', function(message) {    
    var popUpId = getPopUpId(message.fromId);
    if (!popups.includes(popUpId)) {
        openDirectChat(message.fromId, message.fromName);
    }
    receiveDirectMessage(message.fromName, message.fromName, message.text)
});

var message = jQuery('#message');
var sendButton = jQuery('#send');

message.keypress(function(e) {
    if (e.keyCode === 13) {
        sendButton.click();
    }
})

sendButton.on('click', function() {
    var messageTextbox = jQuery('#message');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function() {        
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
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

function messageDirectKeyPress(e, toUser) {
    if (e.keyCode === 13) {
        var popUpId = getPopUpId(toUser);
        jQuery(`#sendDirect_${popUpId}`).click();
    }
}

function sendDirectMessage (toId, toUser) {
    var popUpId = getPopUpId(toUser);
    var messageTextbox = jQuery(`#messageDirect_${popUpId}`);
    receiveDirectMessage(user, toUser, messageTextbox.val())
    
    socket.emit('createDirectMessage', {
        fromId: socket.id,
        fromName: user,
        toId : toId,
        text: messageTextbox.val()
    }, function() {        
        messageTextbox.val('');
    });   
};

function receiveDirectMessage(from, toId, text) {
    var template = jQuery('#message-direct-template').html();
    var html = Mustache.render(template, {from: from, createdAt: moment(message.createdAt).format('h:mm a'),text: text});

    if (from !== user && !document.hasFocus()) {
        notifyNewMessage(from, text, true);
    }
    
    var popUpId = getPopUpId(toId);
    var messages = jQuery(`#messagesDirect_${popUpId}`)
    messages.append(html);
    scrollToBottom(messages);
}

function notifyNewMessage(userName, message, isDirect) {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
        var content = !isDirect ? `${userName} in ${room}: ` : `${userName}: `;
        var notification = new Notification(content, {
        icon: './../images/notificacion.png',
        body: message
      });
      setTimeout(notification.close.bind(notification), 5000);      
    }
}

function openDirectChat(id, name) {
    var popUpId = getPopUpId(name);
    register_popup(popUpId, name, user);

    var template = jQuery('#chatDirect-template').html();
    var html = Mustache.render(template, {messagesDirectId: `messagesDirect_${popUpId}`,
                                          messageDirectId: `messageDirect_${popUpId}`,
                                          sendDirectId: `sendDirect_${popUpId}`,
                                          toId: id,
                                          toUser: name});   
    jQuery(`#popup-messages_${popUpId}`).append(html);
    jQuery(`#messageDirect_${popUpId}`).focus();       
}

function getPopUpId(userName) {
    return `${userName}_${room}`.replace(/ /g,'');
}

