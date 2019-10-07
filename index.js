const Semaphore = require('./services/Semaphore');

const semaphore = new Semaphore(2);

semaphore.p(1);
semaphore.p(1);
semaphore.p(1);
semaphore.p(1);
