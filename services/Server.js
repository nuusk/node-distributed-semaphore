require('dotenv').config();
const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');
const uuidv4 = require('uuid/v4');
const Semaphore = require('./Semaphore');
const Authentication = require('./Authentication');

const {
  DEBUG_ENABLED, SEMAPHORE_CAPACITY, PORT, HOST,
} = process.env;

debug.enabled = DEBUG_ENABLED;

const semaphoreCapacity = SEMAPHORE_CAPACITY || 20;
const port = PORT || 8080;
const host = HOST || 'localhost';

class Server {
  constructor() {
    this.clients = [];
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
  }

  initEvents() {
    this.ws.register('heartBeat', ({ token }) => {
      debug('heartBeated reveived from user ', token);
      debug(this.clients);
    });
    this.ws.register('takeResource', (quantity) => this.semaphore.p(quantity));
    this.ws.register('giveResource', (quantity) => this.semaphore.v(quantity));
    this.ws.register('checkResources', () => this.semaphore.s);
    this.ws.register('getToken', () => {
      const newUser = uuidv4();
      this.clients.push(newUser);
      return newUser;
    });
  }

  initAuth() {
    this.ws.setAuth((user) => {
      const { username, password } = user;
      return this.auth.authenticate(username, password);
    });
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
