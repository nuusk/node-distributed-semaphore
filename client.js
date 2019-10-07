require('dotenv').config();
const WebSocket = require('rpc-websockets').Client;
const debug = require('debug')('client');

const { DEBUG_ENABLED, PORT, HOST } = process.env;

debug.enabled = DEBUG_ENABLED;
const port = PORT || 8080;
const host = HOST || 'localhost';

const ws = new WebSocket(`ws://${host}:${port}`);

let counter;

ws.on('open', () => {
  ws.call('takeResource', 2).then((result) => {
    debug(result);
  }).catch((e) => {
    debug(e);
  });

  // ws.close();
});
