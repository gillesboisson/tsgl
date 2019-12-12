import { WasmClassRelocatable } from "./WasmClassRelocatable";
import { WasmClass } from "./WasmClass";
import { EmscriptenModuleExtended } from "./EmscriptenModuleLoader";
import { wasmStruct } from "./decorators/classes";
import { wasmBoolProp, wasmProp } from "./decorators/props";
import { WasmAllocatorI } from "./allocators/interfaces";
import { wasmFunctionOut } from "./decorators/methods";

const BUFFER_LENGTH_STEP = 32;
const BUFFER_START_LENGTH = BUFFER_LENGTH_STEP;

@wasmStruct({
  methodsPrefix: "PtrBuffer_"
})
export class WasmPtrVector<T extends WasmClassRelocatable> extends WasmClass {
  static byteLength: number;
  static allocator: WasmAllocatorI<WasmPtrVector<WasmClassRelocatable>>;

  //protected buffer: T[];
  protected _buffer: Uint32Array;

  @wasmBoolProp()
  protected _bufferDirty: boolean = false;

  @wasmProp({ length: 4, type: Uint32Array })
  protected metas: Uint32Array;

  private __relocatedListener: (newPtr: number, oldPtr: number) => void;
  private __allocated: boolean;
  get length() {
    return this.metas[0];
  }

  get bufferLength() {
    return this.metas[1];
  }

  get bufferStep() {
    return this.metas[2];
  }

  get bufferPtr() {
    return this.metas[3];
  }
  get bufferDirty() {
    return this._bufferDirty;
  }

  get buffer() {
    if (this._bufferDirty === true) {
      this._buffer = new Uint32Array(
        this._module.HEAP8.buffer,
        this.metas[3],
        this.metas[1]
      );
      this._bufferDirty = false;
    }
    return this._buffer;
  }

  constructor(module?: EmscriptenModuleExtended, ptr?: number,firstInit?: boolean) {
    super(module, ptr, firstInit);
    const metas = this.metas;

    this.__relocatedListener = (newPtr: number, oldPtr: number) =>
      this.ptrRelocated(newPtr, oldPtr);
  }

  init(firstInit?: boolean){
    const metas = this.metas;
    if(firstInit === true) {
      metas[0] = 0;
      metas[1] = BUFFER_LENGTH_STEP;
      metas[2] = BUFFER_LENGTH_STEP;
    }

    if(this.__allocated === undefined) {
      this.__allocated = true;
      metas[3] = this._module._malloc(
        metas[1] * Uint32Array.BYTES_PER_ELEMENT
      );
    }else{
      metas[3] = (<EmscriptenModuleExtended>this._module)._realloc(
        metas[3],
        metas[1] * Uint32Array.BYTES_PER_ELEMENT
      );
    }

    this._buffer = new Uint32Array(
      this._module.HEAP8.buffer,
      metas[3],
      metas[1]
    );

    this._bufferDirty = false;
  }

  protected reallocBuffer(newLength: number) {
    const ptr = this.metas[3];

    const newPtr = (<EmscriptenModuleExtended>this._module)._realloc(
      ptr,
      newLength * Uint32Array.BYTES_PER_ELEMENT
    );
    if(!newPtr) {
      throw new Error('Ptr vector realloc failed')
    }

    const newPtrBuffer = new Uint32Array(
      this._module.HEAP8.buffer,
      newPtr,
      newLength
    );

    this.metas[1] = newLength;
    if (ptr !== newPtr) this.metas[3] = newPtr;

    this._buffer = newPtrBuffer;
    this._bufferDirty = false;
  }

  protected resize(length: number): number {
    const metas = this.metas;

    const newLength = Math.ceil(length / metas[2]) * metas[2];
    if (newLength !== metas[1]) {
      this.reallocBuffer(newLength);
    }

    metas[0] = length;
    return newLength;
  }

  ptrRelocated(newPtr: number, oldPtr: number) {
    const ind = this._buffer.indexOf(oldPtr);
    if (ind !== -1) this._buffer[ind] = newPtr;
  }

  add(element: T) {
    const metas = this.metas;

    if (this._buffer.indexOf(element.ptr) === -1) {
      this.resize(metas[0] + 1);
      this._buffer[metas[0] - 1] = element.ptr;
      element.addRelocateListener(this.__relocatedListener);
    }
  }

  remove(element: T) {
    const oldBuffer = this._buffer;
    const ind = oldBuffer.indexOf(element.ptr);
    if (ind !== -1) {
      oldBuffer.set(oldBuffer.slice(ind + 1), ind);
      this.resize(this.metas[0] - 1);
      element.removeRelocateListener(this.__relocatedListener);
    }
  }

  destroy(freePtr: boolean = true) {
    this._module._free(this.metas[3]);
    super.destroy(freePtr);
    this._buffer = null;
  }

  log() {
    console.log(
      "Buffer ",
      this._ptr,
      this._bufferDirty,
      this.metas,
      this.buffer
    );
  }

  @wasmFunctionOut()
  print: () => void;
  @wasmFunctionOut()
  printBuffer: () => void;
}
