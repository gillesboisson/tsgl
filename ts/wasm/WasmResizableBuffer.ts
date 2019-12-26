import { WasmClassType } from './WasmClass';
import { EmscriptenModuleExtended } from './EmscriptenModuleLoader';
import { AWasmBuffer } from './AWasmBuffer';
import { WasmClassRelocatable } from './WasmClassRelocatable';

export type WasmResizabledBufferOptions<T extends WasmClassRelocatable> = {
  module?: EmscriptenModuleExtended;
  startLength?: number;
  growStep?: number;
  //increaseStep?: number;
  wasmType: WasmClassType<T>;
};

export class WasmResizabledBuffer<T extends WasmClassRelocatable> extends AWasmBuffer<T> {
  //protected startLength: number;
  protected _growStep: number;
  //protected _decreaseStep: number;

  protected _bufferUint: Uint8Array;

  constructor(options: WasmResizabledBufferOptions<T>) {
    super();
    this._wasmType = options.wasmType;
    this._growStep = options.growStep | 20;

    this._length =
      options.startLength && options.startLength > 0
        ? Math.ceil(options.startLength / this._growStep) * this._growStep
        : this._growStep;
    this._module = options.module ? options.module : <EmscriptenModuleExtended>(<any>window).Module;

    this._stride = this._wasmType.byteLength;
    this.allocate();
  }

  allocate() {
    const wasmType = this._wasmType;
    const stride = this._stride;
    const length = this._length;
    const wasmModule = this._module;
    this._byteLength = this._length * this._stride;
    const ptr = (this._ptr = this._module._malloc(length * this._stride));
    this._bufferUint = new Uint8Array(this._module.HEAP8.buffer, this._ptr, this._byteLength);
    let i;
    this._buffer = new Array(length);
    for (i = 0; i < length; i++) {
      this._buffer[i] = new wasmType(wasmModule, ptr + i * stride);
    }
  }

  protected resizeBuffer(length: number) {
    const stride = this._stride;
    const wasmModule = this._module;
    const wasmType = this._wasmType;
    const buffer = this._buffer;
    const byteLength = length * stride;
    const newPtr = wasmModule._realloc(this._ptr, byteLength);

    if (this._ptr !== newPtr) {
      for (let i = 0; i < buffer.length && i < length; i++) {
        buffer[i].relocate(i * stride + newPtr);
      }
    }
    let i;

    if (length > this._length) {
      for (i = this._length; i < length; i++) {
        buffer.push(new wasmType(wasmModule, i * stride + newPtr));
      }
    } else {
      for (i = length; i < this._length; i++) {
        buffer[i].destroy(false);
      }
      buffer.splice(length);
    }

    this._ptr = newPtr;
    this._byteLength = byteLength;
    this._length = length;
  }

  resize(length: number): number {
    const newLength = Math.ceil(length / this._growStep) * this._growStep;

    if (newLength !== this._length) {
      this.resizeBuffer(newLength);
    }

    return newLength;
  }

  grow(amount: number): number {
    if (amount === 0) return;
    return this.resize(amount + this._length);
  }

  reduce(amount: number) {
    if (amount === 0) return;
    return this.resize(amount - this._length);
  }

  addAndGetNewElements(amount: number): T[] {
    const oldLength = this._length;
    const newLength = this.grow(amount + this._length);
    if (oldLength === newLength) return [];

    return this._buffer.slice(oldLength, newLength);
  }

  destroy(): void {
    super.destroy();
  }
}
