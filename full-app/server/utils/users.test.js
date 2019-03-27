const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node course'
    },{
      id: '2',
      name: 'Jen',
      room: 'React course'
    },{
      id: '3',
      name: 'Julie',
      room: 'Node course'
    }]
  })

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: '123',
      name: 'Mario',
      room: 'The office fans'
    };
    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '1';
    let userRemoved = users.removeUser(userId);
    expect(userRemoved.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    let userId = '99';
    let userRemoved = users.removeUser(userId);
    expect(userRemoved).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '1';
    let user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    let userId = '99';
    let user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return names for Node course', () => {
    let userList = users.getUserList('Node course');

    expect(userList).toEqual(['Mike','Julie']);
  });

  it('should return names for React course', () => {
    let userList = users.getUserList('React course');

    expect(userList).toEqual(['Jen']);
  });
});
