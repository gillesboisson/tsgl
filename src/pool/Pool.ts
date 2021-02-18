import { IDestroy } from '../tsgl/base/IDestroy';
import { IPoolable } from './IPoolable';
import { PoolableType } from './PoolableType';

export class Pool<T extends IPoolable> implements IDestroy {
  protected _pool: T[] = [];
  protected _available: T[] = [];
  protected _used: T[] = [];

  constructor(protected Type: PoolableType<T>, allocate = 0) {
    for (let i = 0; i < allocate; i++) {
      this._available.push(this.create());
    }
  }

  create(): T {
    const element = new this.Type();
    if (element.release === undefined) element.release = () => this.release(element);
    this._pool.push(element);
    return element;
  }

  pull(): T {
    let element: T = null;
    if (this._available.length === 0) {
      element = new this.Type();

      this._pool.push(element);
    } else {
      element = this._available.pop();
      element.reset();
    }

    this._used.push(element);
    return element;
  }

  release(element: T): void {
    const ind = this._used.indexOf(element);
    if (ind !== -1) {
      this._used.splice(ind, 1);
      this._available.push(element);
      if (element.released !== undefined) element.released();
    }
  }

  releaseAll(): void {
    if (this._used.length === 0) {
      const released = this._used.splice(0, this._used.length);
      this._available.push(...released);
      if (this.Type.prototype.releaded !== undefined) {
        for (const element of released) {
          element.released();
        }
      }
    }
  }

  destroyElement(element: T): void {
    const ind = this._used.indexOf(element);
    if (ind !== -1) {
      const indU = this._used.indexOf(element);
      if (indU === -1) {
        this._used.splice(indU, 1);
      } else {
        const indR = this._available.indexOf(element);
        if (indR === -1) {
          this._available.splice(indU, 1);
        }
      }

      element.destroy();
    }
  }

  destroy(): void {
    for (const element of this._pool) {
      element.destroy();
    }

    this._pool = null;
    this._used = null;
    this._available = null;
  }
}
