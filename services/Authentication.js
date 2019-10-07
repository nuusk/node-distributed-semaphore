class Authentication {
  constructor() {
    this.users = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      poe: 'poe',
      peterpan: 'peterpan',
    };
  }

  authenticate(username, password) {
    if (this.users[username] === password) return true;
    return false;
  }
}

module.exports = Authentication;
