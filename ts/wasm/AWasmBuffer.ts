import { WasmClass, WasmClassType } from './WasmClass';
import { IDestroy } from '../core/IDestroy';
import { EmscriptenModuleExtended } from './EmscriptenModuleLoader';

export abstract class AWasmBuffer<T extends WasmClass> implements IDestroy {
  public _buffer: T[];
  protected _ptr: number;
  protected _wasmType: WasmClassType<T> = null;
  protected _length: number;
  protected _byteLength: number;
  protected _module?: EmscriptenModuleExtended = null;
  protected _stride: number;

  get ptr(): number {
    return this._ptr;
  }

  get length(): number {
    return this._length;
  }

  get stride() {
    return this._stride;
  }

  get wasmType(): WasmClassType<T> {
    return this._wasmType;
  }

  get module(): EmscriptenModuleExtended {
    return this._module;
  }

  constructor() {}

  getElements(): T[] {
    return this._buffer;
  }

  getElementFromPtr(ptr: number): T {
    return this._buffer[(ptr - this._ptr) / this._stride];
  }

  abstract allocate(): void;

  destroy(): void {
    const buffer = this._buffer;
    const length = buffer.length;
    let i;
    for (i = 0; i < length; i++) {
      buffer[i].destroy(false);
      this._module._free(this._ptr);
    }

    this._ptr = null;
    this._buffer.splice(0);
    this._buffer = null;
  }
}
