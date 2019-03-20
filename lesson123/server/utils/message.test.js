const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {

  it('should generate the correct messsage object', () => {
    let from = 'testFrom';
    let text = 'test text';
    let message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(typeof message.createdAt).toBe('number');
  });

});

describe('generateLocationMessage', () => {

  it('should generate the correct location message object', () => {
    let from = 'testFrom';
    let latitude = '37.0637391';
    let longitude = '5.65379250';
    let url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    let message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude({from, url});
    expect(typeof message.createdAt).toBe('number');
  });

});
