require('dotenv').config();
const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');
const Semaphore = require('./services/Semaphore');

const { DEBUG_ENABLED, SEMAPHORE_CAPACITY } = process.env;

debug.enabled = DEBUG_ENABLED;

const server = new WebSocketServer({
  port: 8080,
  host: 'localhost',
});

const semaphoreCapacity = SEMAPHORE_CAPACITY || 20;

debug('Attempting to create a semaphore');
const semaphore = new Semaphore(semaphoreCapacity).then((message) => {
  debug(message);
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
