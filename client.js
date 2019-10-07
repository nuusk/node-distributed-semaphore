const Client = require('./services/Client');

const client = new Client();

client.connect().then(() => {
  client.takeResource(Math.floor(4 * Math.random()));
});
