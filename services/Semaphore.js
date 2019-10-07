class Semaphore {
  constructor(s) {
    this.s = s;
  }

  v() {
    this.s += 1;
  }

  p() {
    this.s -= 1;
  }
}

export default Semaphore;
