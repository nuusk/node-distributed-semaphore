require('dotenv').config();
const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');
const uuidv4 = require('uuid/v4');
const Semaphore = require('./Semaphore');
const Authentication = require('./Authentication');
const { seconds } = require('../helpers/time');

const {
  DEBUG_ENABLED, SEMAPHORE_CAPACITY, PORT, HOST, TIME_TO_LIVE,
} = process.env;

debug.enabled = DEBUG_ENABLED;

const semaphoreCapacity = SEMAPHORE_CAPACITY || 20;
const port = PORT || 8080;
const host = HOST || 'localhost';
const timeToLive = TIME_TO_LIVE || seconds(10);

class Server {
  constructor() {
    this.clients = {};
    this.auth = new Authentication();

    debug('Attempting to create a semaphore.');
    this.semaphore = new Semaphore(semaphoreCapacity);
  }

  listen() {
    this.ws = new WebSocketServer({ port, host });
    debug(`Server started on ${host}:${port}`);

    this.initEvents();
    this.initAuth();
    this.initListeners();
    this.initTTL();
  }

  initEvents() {
    this.ws.register('heartBeat', ({ token }) => {
      debug('heartBeated reveived from user ', token);
      debug(this.clients);
      this.clients[token].timeToLive = timeToLive;
    });
    this.ws.register('takeResources', ({ quantity, token }) => new Promise((resolve) => {
      this.semaphore.p(quantity).then((resources) => {
        this.clients[token].resources += resources;
        resolve(resources);
      });
    }));
    this.ws.register('giveResources', ({ quantity, token }) => new Promise((resolve) => {
      this.semaphore.v(quantity).then((resources) => {
        this.clients[token].resources -= resources;
        resolve(resources);
      });
    }));
    this.ws.register('checkResources', () => this.semaphore.s);
    this.ws.register('getToken', () => {
      const newUser = uuidv4();
      this.clients[newUser] = {
        timeToLive,
        resources: 0,
      };
      return newUser;
    });
  }

  initAuth() {
    this.ws.setAuth((user) => {
      const { username, password } = user;
      return this.auth.authenticate(username, password);
    });
  }

  initTTL() {
    const tickTTL = seconds(2);

    Object.keys(this.clients).forEach((client) => {
      if (this.clients[client].timeToLive <= tickTTL) {
        this.semaphore.v(this.clients[client].resources).then(() => {
          delete this.clients[client];
        });
      } else {
        this.clients[client].timeToLive -= tickTTL;
      }
    });

    setTimeout(() => {
      this.initTTL();
    }, tickTTL);
  }

  initListeners() {
    this.ws.on('connection', () => {
      debug('client connected');
    });

    this.ws.on('error', (err) => {
      debug(err);
    });
  }
}

module.exports = Server;
