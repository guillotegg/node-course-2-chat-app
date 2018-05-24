var expect = require("expect");

const {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            'id' : '1',
            'name' : 'Mike',
            'room' : 'Room1'
        }, {
            'id' : '2',
            'name' : 'Jhon',
            'room' : 'Room2'
        }, {
            'id' : '3',
            'name' : 'Mark',
            'room' : 'Room1'
        }];
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {'id' : '123',
                    'name' : 'Billy',
                    'room' : 'Alternative Rock'};
        
        var result = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var user = users.users[0];
        users.removeUser(user.id);
        expect(users.users).not.toContain(user);
    });

    it('should not remove a user', () => {
        users.removeUser(4);
        expect(users.users.length).toBe(3);
    });
    
    it('should find a user', () => {
        var user = users.users[0];
        var result = users.getUser(user.id);
        expect(result).toEqual([user]);
    });

    it('should not find a user', () => {
        var result = users.getUser(4);
        expect(result).toEqual([]);
    });

    it('should get a list of users names for a given room', () => {
        var userList = users.getUserList('Room1');
        expect(userList).toEqual([users.users[0].name, users.users[2].name]);
    });
});