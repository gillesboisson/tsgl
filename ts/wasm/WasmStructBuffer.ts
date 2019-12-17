import { WasmClass, WasmClassType } from './WasmClass';
import { wasmStruct } from './decorators/classes';
import { structAttr } from '../core/decorators/StructAttribute';
import { WasmAllocatorI } from './allocators/interfaces';
import { wasmFunctionOut } from './decorators/methods';

@wasmStruct()
export class WasmStructBuffer<T extends WasmClass> extends WasmClass {
  static byteLength: number;

  // WASM metas
  @structAttr({
    type: Uint32Array,
    length: 3,
  })
  protected _metas: Uint32Array;

  // Accessors
  get length() {
    return this._metas[0];
  }

  get stride() {
    return this._metas[1];
  }
  get bufferPtr() {
    return this._metas[2];
  }

  get buffer(): Uint8Array {
    return this._buffer;
  }

  get collection(): T[] {
    return this._collection;
  }

  get bufferByteLength(): number {
    return this._metas[0] * this._metas[1];
  }

  protected _buffer: Uint8Array;
  protected _collection: T[];

  constructor(
    protected _wasmType: WasmClassType<T>,
    length: number,
    module?: EmscriptenModule,
    ptr?: number,
    firstInit?: boolean,
  ) {
    super(module, ptr, firstInit);

    const bufferSize = length * _wasmType.byteLength;
    const stride = _wasmType.byteLength;

    this._metas[0] = length;
    this._metas[1] = stride;
    const bufferPtr = (this._metas[2] = this._module._malloc(bufferSize));
    this._collection = new Array(length);

    for (let i = 0; i < length; i++) {
      this._collection[i] = new _wasmType(this._module, bufferPtr + i * stride, true);
    }

    this._buffer = new Uint8Array(this._module.HEAP16.buffer, this._metas[2], bufferSize);
  }

  init(firstInit?: boolean) {}

  destroy(freePtr?: boolean) {
    const collection = this._collection;
    const l = this._collection.length;
    for (let i = 0; i < l; i++) {
      collection[i].destroy(false);
    }

    delete this._collection;
    delete this._buffer;
    this._collection.splice(0);

    this._module._free(this._metas[2]);
    delete this._metas;
    super.destroy(freePtr);
  }
}
