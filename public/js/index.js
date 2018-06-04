var env = window.location.href.search('localhost') > 0 ? 'http://localhost:3000' : 'http://#';

$(() => {
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
        alert("Name and Room are required!")
        return false;
    }

    e.preventDefault();
    $.get(`${env}/user/?name=${name}&room=${room}`)
        .done(function(data) {
           if (data) {
                alert(`The name "${data.name}" is already being used by another user. Please choose a different one.`);                              
            } else {
                $('#frmJoin').submit();
            }
        });        
});