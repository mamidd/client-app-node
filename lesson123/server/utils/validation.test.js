const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non string values', () => {
    let str = 9;
    expect(isRealString(str)).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let str = "     ";
    expect(isRealString(str)).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    let str = "  Lord of the Rings   ";
    expect(isRealString(str)).toBe(true);
  });
});
