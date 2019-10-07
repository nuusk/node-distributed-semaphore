require('dotenv').config();
const WebSocketServer = require('rpc-websockets').Server;
const debug = require('debug')('server');
const Semaphore = require('./services/Semaphore');

const {
  DEBUG_ENABLED, SEMAPHORE_CAPACITY, PORT, HOST,
} = process.env;

debug.enabled = DEBUG_ENABLED;

const semaphoreCapacity = SEMAPHORE_CAPACITY || 20;
const port = PORT || 8080;
const host = HOST || 'localhost';

debug('Attempting to create a semaphore.');
const semaphore = new Semaphore(semaphoreCapacity);

const server = new WebSocketServer({ port, host });
debug(`Server started on ${host}:${port}`);

server.register('takeResource', (quantity) => semaphore.p(quantity));
