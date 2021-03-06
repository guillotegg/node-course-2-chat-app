const _ = require('lodash');

class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        return _.remove(this.users, (user) => user.id === id )[0];
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserByName(name, room) {
        var users = this.users.filter((user) => user.room === room);
        return users.filter((user) => user.name === name)[0];
    }

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var names= users.map((user) => user);
        return names;
    }
}

module.exports = {Users};