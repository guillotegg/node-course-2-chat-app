var env = window.location.href.search('localhost') > 0 ? 'http://localhost:3000' : 'https://safe-fortress-69635.herokuapp.com';

$(() => {
    jQuery('#effect').hide();

    $.get(`${env}/rooms`)
        .done(function(data) {
        if (data) {            
                $.each(data, function (i, room) {
                    $('#room').append($('<option>', { 
                        value: room,
                        text : room 
                    }));                    
                });
            };
            $('#room').editableSelect({effects: 'slide'});
        });
});

$('#btnJoin').on('click', (e) => {
    var name = $('#name').val();
    var room = $('#room').val();
    
    if (!name.trim() || !room.trim()) {
        $("#effect").hide().html('<p>Name and Room required!</p>').toggle('shake');
        return false;
    }

    e.preventDefault();
    $.get(`${env}/user/?name=${name}&room=${room}`)
        .done(function(data) {
           if (data) {
                $("#effect").hide().html(`<p>The name "${data.name}" is already being used by another user. Please choose a different one.</p>`).toggle('shake');
            } else {
                $('#frmJoin').submit();
            }
        });        
});