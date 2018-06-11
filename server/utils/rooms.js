function findRooms(io) {
    var availableRooms = [];
    var rooms = io.sockets.adapter.rooms;
    console.log(rooms);
    // debugger;        
    if (rooms) {
        for (var room in rooms) {
            if (!rooms[room].hasOwnProperty(room)) {
                !(room in rooms[room].sockets) && availableRooms.push(room);
            }
        }
    }
    return availableRooms.sort();
}

module.exports = {findRooms};