require('dotenv').config();
const debug = require('debug')('services/semaphore');
const uuidv4 = require('uuid/v4');
const { seconds } = require('../helpers/time');

const { DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

class Semaphore {
  constructor(s) {
    return new Promise((resolve) => {
      this.s = s;
      this.capacity = s;
      this.intervalSpeed = seconds(3);

      resolve(`Semaphore with capacity of ${this.capacity} created successfully.`);
    });
  }

  v(value) {
    return new Promise((resolve) => {
      this.s += value;
      resolve();
    });
  }

  p(value) {
    const operationId = uuidv4();
    debug(`Operation [${operationId}] started.`);
    return new Promise((resolve) => {
      let tryNumber = 0;
      const interval = setInterval(() => {
        debug(`[${operationId}] s: ${this.s}, try: ${tryNumber}`);
        tryNumber += 1;
        if (this.s >= value) {
          clearInterval(interval);
          debug(`Operation [${operationId}] finished.`);
          this.s -= 1;
          resolve();
        }
      }, this.intervalSpeed);
    });
  }
}

module.exports = Semaphore;
