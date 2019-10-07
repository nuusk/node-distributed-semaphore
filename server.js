const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');

const server = new WebSocketServer({
  port: 8080,
  host: 'localhost',
});

// register an RPC method
server.register('sum', (params) => params[0] + params[1]);

// ...and maybe a protected one also
// server.register('account', () => ['confi1', 'confi2']).protected();

// Creates a new event that can be emitted to clients.
// server.event('feedUpdated');

// get events
// console.log(server.eventList());

// emit an event to subscribers
// server.emit('feedUpdated');

// close the server
// server.close();
