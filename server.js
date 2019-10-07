require('dotenv').config();
const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');
const uuidv4 = require('uuid/v4');
const Semaphore = require('./services/Semaphore');
const Authentication = require('./services/Authentication');

const {
  DEBUG_ENABLED, SEMAPHORE_CAPACITY, PORT, HOST,
} = process.env;

debug.enabled = DEBUG_ENABLED;

const semaphoreCapacity = SEMAPHORE_CAPACITY || 20;
const port = PORT || 8080;
const host = HOST || 'localhost';

const auth = new Authentication();

debug('Attempting to create a semaphore.');
const semaphore = new Semaphore(semaphoreCapacity);

const server = new WebSocketServer({ port, host });
debug(`Server started on ${host}:${port}`);

const clients = [];

server.register('heartBeat', () => { debug('heartBeated...'); debug(clients); });
server.register('takeResource', (quantity) => semaphore.p(quantity));
server.register('giveResource', (quantity) => semaphore.v(quantity));
server.register('getToken', () => {
  const newUser = uuidv4();
  clients.push(newUser);
  return newUser;
});
// server.register('account', () => ['confi1', 'confi2']).protected();
server.setAuth((user) => {
  const { username, password } = user;
  return auth.authenticate(username, password);
});
server.on('connection', () => {
  debug('client connected');
});

server.on('error', (err) => {
  debug(err);
});
