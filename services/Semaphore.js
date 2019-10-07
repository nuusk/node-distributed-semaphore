require('dotenv').config();
const debug = require('debug')('services/semaphore');
const { seconds } = require('../helpers/time');

const { DEBUG_ENABLED } = process.env;

debug.enabled = DEBUG_ENABLED;

class Semaphore {
  constructor(s) {
    this.s = s;
    this.capacity = s;
    this.intervalSpeed = seconds(1);
  }

  v(value) {
    return new Promise((resolve) => {
      this.s += value;
      resolve();
    });
  }

  p(value) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        debug(`s: ${this.s}, try: ${i}`);
        i += 1;
        if (this.s >= value) {
          clearInterval(interval);
          debug('Cleared.');
          this.s -= 1;
          resolve();
        }
      }, this.intervalSpeed);
    });
  }
}

module.exports = Semaphore;
