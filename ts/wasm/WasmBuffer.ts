import { WasmClass, WasmClassType } from './WasmClass';
import { allocateMultipleWasmClasses } from './utils';
import { AWasmBuffer } from './AWasmBuffer';
import { EmscriptenModuleExtended } from './EmscriptenModuleLoader';

export type WasmBufferOptions<T extends WasmClass> = {
  module?: EmscriptenModuleExtended;
  length?: number;
  wasmType: WasmClassType<T>;
  buffer?: WasmBuffer<T>;
};

export class WasmBuffer<T extends WasmClass> extends AWasmBuffer<T> {
  constructor(options: WasmBufferOptions<T>) {
    super();
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
