require('dotenv').config();
const WebSocket = require('rpc-websockets').Client;
const debug = require('debug')('client');
const { seconds } = require('./helpers/time');

const {
  DEBUG_ENABLED, PORT, HOST, HEART_BEAT_SPEED,
} = process.env;

debug.enabled = DEBUG_ENABLED;
const port = PORT || 8080;
const host = HOST || 'localhost';
const heartBeatSpeed = HEART_BEAT_SPEED || seconds(5);

const ws = new WebSocket(`ws://${host}:${port}`);

const heartBeat = () => {
  ws.notify('heartBeat');

  setTimeout(heartBeat, heartBeatSpeed);
};

const main = () => {
  ws.login({ username: 'poe', password: 'poe' })
    .then((message) => {
      debug(message);
    }).catch((e) => { debug(e); });


  // ws.call('takeResource', 2).then((result) => {
  //   debug(result);
  // }).catch((e) => {
  //   debug(e);
  // });

  heartBeat();
};

const cleanUp = () => {
  ws.call('giveResource', 2).then((result) => {
    debug(result);
  }).catch((e) => {
    debug(e);
  });
};

ws.on('open', main);
ws.on('close', cleanUp);
