const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {

  it('should generate the correct messsage object', () => {
    let from = 'testFrom';
    let text = 'test text';
    let message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(typeof message.createdAt).toBe('number');
  })

})
