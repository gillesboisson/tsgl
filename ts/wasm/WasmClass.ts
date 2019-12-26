import { WasmAllocatorI } from './allocators/interfaces';
import { IInterleaveData } from '../gl/data/IInterleaveData';

export abstract class WasmClass {
  // custo properties defined by class allocator
  private __allocator: WasmAllocatorI<WasmClass>;
  protected byteLength: number;

  // custom hooks defined by class decorator
  private __destroy: () => void;
  private __addToIndex() {}
  private __removeFromIndex() {}

  protected _memoryRef: Uint8Array;

  protected _ptr: number = -1;

  get ptr(): number {
    return this._ptr;
  }

  get memoryBuffer(): Uint8Array {
    return this._memoryRef;
  }

  constructor(protected _module?: EmscriptenModule, ptr?: number, firstInit = ptr === undefined) {
    if (this.__allocator === undefined) throw new Error('No decorator defined');

    if (!_module) _module = <EmscriptenModule>(<any>window).Module;
    this._module = _module;

    if (ptr === undefined) {
      ptr = this.__allocator.allocate(_module, this);
    }

    this.allocate(_module.HEAP8.buffer, ptr);

    this._ptr = ptr;
    this._memoryRef = new Uint8Array(this._module.HEAP8.buffer, this._ptr, this.byteLength);
    this.__addToIndex();
    this.init(firstInit);
  }

  destroy(freePtr = true) {
    this.__removeFromIndex();
    if (freePtr) this.__allocator.deallocate(this._module, this._ptr);
    this.__destroy();
    this._memoryRef = null;
    this._module = null;
    this._ptr = -1;
  }

  copy<T extends WasmClass>(base: T): T {
    base._memoryRef.set(this._memoryRef);
    return base;
  }

  // dynamically implemented
  allocate: (arrayBuffer: ArrayBuffer, offset: number) => void;

  release: () => void;
  released: () => void;

  init(firstInit = true): void {}
  reset() {}
}

export interface WasmClassType<T extends WasmClass> extends Function {
  new (module: EmscriptenModule, ptr?: number, firstInit?: boolean): T;

  byteLength: number;
  allocator: WasmAllocatorI<T>;
}
