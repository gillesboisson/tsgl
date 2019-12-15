export class PerfTimer {
  private t0: number;
  private times: number[];
  private labels: string[];
  private length: number;

  constructor() {
    this.times = new Array(128);
    this.labels = new Array(128);
    this.length = 0;
    this.t0 = 0;
  }

  start() {
    this.length = 0;
    this.t0 = new Date().getTime();
  }

  tick(label: string) {
    this.labels[this.length] = label;
    this.times[this.length] = new Date().getTime() - this.t0;
    this.length++;
  }

  log() {
    let t0;
    for (let i = 0; i < this.length; i++) {
      t0 = i > 0 ? this.times[i - 1] : 0;
      const time = this.times[i];
      console.log(this.labels[i], time - t0, time);
    }
  }

  copyStep(ind: number, times: number[]) {
    times.push(this.times[ind]);
  }

  stepOf(label: string) {
    const ind = this.labels.indexOf(label);
    if (ind !== -1) return this.labels[ind];
    return null;
  }

  copyTimes(times: number[]) {
    for (let i = 0; i < this.length; i++) {
      times.push(this.times[i]);
    }
  }
}
