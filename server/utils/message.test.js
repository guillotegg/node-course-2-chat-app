var expect = require("expect");

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        
        var from = 'Admin';
        var text = "this is a test";
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
        
    })
})

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        
        var from = 'Admin';
        var latitude = 100;
        var longitude = 200;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var locationMessage = generateLocationMessage(from, latitude, longitude);        
        
        expect(typeof locationMessage.createdAt).toBe('number');
        expect(locationMessage).toMatchObject({from, url});
        
    })
})