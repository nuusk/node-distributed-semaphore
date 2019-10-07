const WebSocket = require('rpc-websockets').Client;
const WebSocketServer = require('rpc-websockets').Server;
const assert = require('assert');

// instantiate Server and start listening for requests
const server = new WebSocketServer({
  port: 8080,
  host: 'localhost',
});

// register an RPC method
server.register('sum', (params) => params[0] + params[1]);

// ...and maybe a protected one also
server.register('account', () => ['confi1', 'confi2']).protected();

// create an event
server.event('feedUpdated');

// get events
console.log(server.eventList());

// emit an event to subscribers
server.emit('feedUpdated');

// close the server
server.close();

// instantiate Client and connect to an RPC server
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  // call an RPC method with parameters
  ws.call('sum', [5, 3]).then((result) => {
    assert.equal(result, 8);
  });

  // send a notification to an RPC server
  ws.notify('openedNewsModule');

  // subscribe to receive an event
  ws.subscribe('feedUpdated');

  ws.on('feedUpdated', () => {
    // updateLogic();
  });

  // unsubscribe from an event
  ws.unsubscribe('feedUpdated');

  // login your client to be able to use protected methods
  ws.login({ username: 'confi1', password: 'foobar' }).then(() => {
    ws.call('account'), then((result) => {
      require('assert').equal(result, ['confi1', 'confi2']);
    });
  });

  // close a websocket connection
  ws.close();
});
