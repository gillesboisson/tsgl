export interface IAnimated {
  animationStart(): void;
  animationEnd(time: number): void;
  animationUpdate(time: number, elapsedTime: number): void;
}

export interface IStartStop {
  start(): void;
  stop(): void;
}

export interface IStartStopPause extends IStartStop {
  pause(): void;
}

export class Juggler implements IStartStop {
  protected _t: number;
  protected _children: IAnimated[] = [];
  protected _active: boolean = false;

  addChild(child: IAnimated) {
    if (this._children.indexOf(child) === -1) {
      this._children.push(child);
    }
  }

  removeChild(child: IAnimated) {
    const ind = this._children.indexOf(child);
    if (ind !== -1) {
      this._children.splice(ind, 1);
    }
  }

  start() {
    this._t = 0;
    this._active = true;
    for (let child of this._children) {
      child.animationStart();
    }
  }

  update(elapsedTime: number) {
    if (this._active === false) return;
    const t = this._t + elapsedTime;
    for (let child of this._children) {
      child.animationUpdate(t, elapsedTime);
    }
    this._t = t;
  }

  stop() {
    this._active = false;
    for (let child of this._children) {
      child.animationEnd(this._t);
    }
  }
}
