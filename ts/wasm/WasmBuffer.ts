import { WasmClass, WasmClassType } from './WasmClass';
import { allocateMultipleWasmClasses } from './utils';
import { AWasmBuffer } from './AWasmBuffer';
import { EmscriptenModuleExtended } from './EmscriptenModuleLoader';
import { IInterleavedDataArray } from '../gl/data/InterleavedDataArray';

export type WasmBufferOptions<T extends WasmClass> = {
  module?: EmscriptenModuleExtended;
  length?: number;
  wasmType: WasmClassType<T>;
  buffer?: WasmBuffer<T>;
};

export class WasmBuffer<T extends WasmClass> extends AWasmBuffer<T> implements IInterleavedDataArray<T> {
  private __byteLength: number;
  private __typedArray: Uint8Array;
  get byteLength(): number {
    return this.__byteLength;
  }

  get stride(): number {
    return this._stride;
  }

  get collection(): T[] {
    return this._buffer;
  }

  get arrayBuffer(): ArrayBuffer {
    return <ArrayBuffer>this._module.HEAP8.buffer;
  }

  get bufferView(): ArrayBufferView {
    return this.__typedArray;
  }

  constructor(options: WasmBufferOptions<T>) {
    super();
    if (!this._module) this._module = <EmscriptenModuleExtended>(<any>window).Module;

    if (options.buffer !== undefined) {
      this._module = options.buffer.module;
      this._length = options.buffer.length;
      this._buffer = options.buffer.getElements();
      this._wasmType = options.buffer.wasmType;
      this._ptr = options.buffer.ptr;
      this._stride = options.buffer.wasmType.byteLength;
    } else {
      this._module = options.module;
      this._length = options.length;
      this._wasmType = options.wasmType;
      this._stride = options.wasmType.byteLength;
      this.allocate();
    }

    this.__byteLength = this._stride * this._length;
    this.__typedArray = new Uint8Array(this._module.HEAP8.buffer, this._ptr, this.__byteLength);
  }

  allocate() {
    this._byteLength = this._length * this._stride;
    this._buffer = allocateMultipleWasmClasses(this._wasmType, this._length, this._module);
    this._ptr = this._buffer[0].ptr;
  }

  destroy() {
    this._module._free(this._ptr);
    for (let cl of this._buffer) cl.destroy(false);
    this._buffer = null;
  }
}
