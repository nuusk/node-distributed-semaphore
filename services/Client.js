require('dotenv').config();
const WebSocket = require('rpc-websockets').Client;
const debug = require('debug')('client');
const { seconds } = require('../helpers/time');

const {
  DEBUG_ENABLED, PORT, HOST, HEART_BEAT_SPEED,
} = process.env;

debug.enabled = DEBUG_ENABLED;
const port = PORT || 8080;
const host = HOST || 'localhost';
const heartBeatSpeed = HEART_BEAT_SPEED || seconds(1);

class Client {
  constructor() {
    this.resources = 0;
    this.token = null;
  }

  connect() {
    return new Promise((resolve) => {
      this.ws = new WebSocket(`ws://${host}:${port}`);

      this.ws.on('open', () => {
        this.ws.login({ username: 'poe', password: 'poe' })
          .then((status) => {
            debug(status ? 'Successfully logged in' : 'Authentication failure');
            this.ws.call('getToken').then((myToken) => {
              this.token = myToken;
              resolve(this.token);
              this.heartBeat(myToken);
            });
          }).catch((err) => { debug(err); });
      });

      this.ws.on('close', this.cleanUp.bind(this));
    });
  }

  heartBeat() {
    this.ws.call('heartBeat', { token: this.token });
    setTimeout(this.heartBeat.bind(this), heartBeatSpeed);
  }

  cleanUp() {
    this.ws.call('giveResources', this.resources).then((result) => {
      debug(result);
    }).catch((e) => {
      debug(e);
    });
  }

  giveResources(quantity) {
    if (this.resource >= quantity) {
      this.ws.call('giveResources', quantity).then((result) => {
        debug(result);
      }).catch((e) => {
        debug(e);
      });
    } else {
      debug(`\n[${this.token}] Not enough resources.`);
    }
  }

  takeResources(quantity) {
    this.ws.call('takeResources', quantity).then((resources) => {
      debug(`\n[${this.token}] I got ${resources} resources.`);
      this.resources += resources;
    }).catch((e) => {
      debug(e);
    });
  }

  checkResources() {
    this.ws.call('checkResources').then((resources) => {
      debug(`\n[${this.token}] The server has ${resources} resources left.`);
      debug(`[${this.token}] I have ${this.resources} resources left.`);
    }).catch((e) => {
      debug(e);
    });
  }
}

module.exports = Client;
