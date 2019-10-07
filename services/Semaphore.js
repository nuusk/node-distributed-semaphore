require('dotenv').config();
const debug = require('debug')('services/semaphore');
const uuidv4 = require('uuid/v4');
const { seconds } = require('../helpers/time');

const { DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

class Semaphore {
  constructor(s) {
    this.s = s;
    this.capacity = s;
    this.intervalSpeed = seconds(3);

    debug(`Semaphore with capacity of ${this.capacity} created successfully.`);
  }

  v(value) {
    return new Promise((resolve) => {
      this.s += value;
      resolve(value);
    });
  }

  p(value) {
    const operationId = uuidv4();
    debug(`[${operationId}] Operation started.`);
    return new Promise((resolve) => {
      let tryNumber = 0;

      const tryOperation = () => {
        debug(`[${operationId}] s: ${this.s}, try: ${tryNumber}`);
        tryNumber += 1;
        if (this.s >= value) {
          debug(`[${operationId}] Operation finished.`);
          this.s -= value;
          resolve(value);
        } else {
          setTimeout(tryOperation, this.intervalSpeed);
        }
      };

      tryOperation();
    });
  }
}

module.exports = Semaphore;
