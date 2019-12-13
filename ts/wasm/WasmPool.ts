import { WasmBuffer, WasmBufferOptions } from './WasmBuffer';
import { WasmClass, WasmClassType } from './WasmClass';
import { IPool, IPoolable } from '../core/Pool';
import { wasmStruct } from './decorators/classes';
import { structBool } from '../core/decorators/StructAttribute';

@wasmStruct({ methodsPrefix: 'WarmPool_' })
export abstract class WasmClassPoolable extends WasmClass {
  @structBool()
  enabled: boolean = false;
}

export class WasmPool<T extends WasmClassPoolable> extends WasmBuffer<T> implements IPool<T> {
  protected _available: T[];
  protected _used: T[];

  get used(): T[] {
    return this._used;
  }

  constructor(options: WasmBufferOptions<T>) {
    super(options);
    this._available = [...this._buffer];
    this._used = [];
  }

  destroyElement(element: T): void {
    element.destroy();
  }

  getFromPtr(ptr: number): T {
    return this._buffer[(ptr - this.ptr) / this._wasmType.byteLength];
  }

  setPoolFromElementsEnabledState(): void {
    for (let element of this._buffer) {
      if (element.enabled === true) {
        const ind = this._available.indexOf(element);
        if (ind !== -1) {
          this._available.splice(ind);
          this._used.push(element);
        }
      } else {
        const ind = this._used.indexOf(element);
        if (ind !== -1) {
          this._used.splice(ind);
          this._available.push(element);
        }
      }
    }
  }

  setElementEnabledFromPool(): void {
    for (let element of this._used) element.enabled = true;
    for (let element of this._available) element.enabled = false;
  }

  pull(): T {
    let element: T = null;
    if (this._available.length === 0) {
      throw new Error('No available elements');
    } else {
      element = this._available.pop();
      element.enabled = true;
      element.init();
    }

    this._used.push(element);
    return element;
  }

  release(element: T): void {
    const ind = this._used.indexOf(element);
    if (ind !== -1) {
      this._used.splice(ind, 1);
      this._available.push(element);
      element.enabled = false;
      if (element.released !== undefined) element.released();
    }
  }

  releaseAll() {
    if (this._used.length === 0) {
      const released = this._used.splice(0, this._used.length);
      this._available.push(...released);
      if (this._wasmType.prototype.released !== undefined) {
        for (let element of released) {
          element.released();
        }
      }
    }
  }

  destroy() {
    super.destroy();
    this._used = null;
    this._available = null;
  }
}
