require('dotenv').config();
const WebSocket = require('rpc-websockets').Client;
const assert = require('assert');
const debug = require('debug')('client');

const { DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

// instantiate Client and connect to an RPC server
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  // call an RPC method with parameters
  ws.call('sum', [5, 3]).then((result) => {
    debug(result);
    assert.equal(result, 8);
  });

  // send a notification to an RPC server
  // ws.notify('openedNewsModule');

  // subscribe to receive an event
  // ws.subscribe('feedUpdated');

  // ws.on('feedUpdated', () => {
  // updateLogic();
  // });

  // unsubscribe from an event
  // ws.unsubscribe('feedUpdated');

  // login your client to be able to use protected methods
  // ws.login({ username: 'confi1', password: 'foobar' }).then(() => {
  //   ws.call('account'), then((result) => {
  //     require('assert').equal(result, ['confi1', 'confi2']);
  //   });
  // });

  // close a websocket connection
  // ws.close();
});
