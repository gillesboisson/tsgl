import { wasmStruct } from "./decorators/classes";
import { wasmBoolProp, wasmProp } from "./decorators/props";
import { EmscriptenModuleExtended } from "./EmscriptenModuleLoader";
import { WasmClass } from "./WasmClass";
import { TypedArrayType } from "./utils";

const DEFAULT_BUFFER_LENGTH_STEP = 32;

export type WasmBufferStateUpdateFunc = (
  ptr: number,
  index: number,
  length: number
) => void;

@wasmStruct({
  methodsPrefix: "StackBuffer_"
})
export class WasmStack extends WasmClass {
  protected _buffer: Uint8Array;

  /**
   * JS defined buffer used to detect if buffer has been changed during assembly execution
   */
  private __jsBufferLength: number = -1;
  /**
   * JS defined buffer used to detect if buffer has been changed during assembly execution
   */
  private __jsBufferPtr: number = -1;



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

  get bufferStride() {
    return this.metas[4];
  }



  @wasmProp({ length: 5, type: Uint32Array })
  protected metas: Uint32Array;

  /**
   * Define if buffer is shrinked automatically if it's size is reduced
   */
  @wasmBoolProp()
  public autoShrinkBuffer: boolean = false;

  constructor(
    bufferStride: number,
    bufferStep = DEFAULT_BUFFER_LENGTH_STEP,
    module?: EmscriptenModuleExtended
  ) {
    super(module);
    const metas = this.metas;
    metas[0] = 0;
    metas[1] = bufferStep;
    metas[2] = bufferStep;
    metas[3] = this._module._malloc(bufferStride * bufferStep);
    metas[4] = bufferStride;
  }

  getBuffer() {
    const metas = this.metas;
    if (
      this.__jsBufferLength !== metas[1] ||
      this.__jsBufferPtr !== metas[3] ||
      this._buffer === undefined
    )
      this.syncBuffer(metas);

    return this._buffer;
  }

  protected syncBuffer(metas: Uint32Array) {
    this.__jsBufferLength = metas[1];
    this.__jsBufferPtr = metas[3];
    this._buffer = new Uint8Array(
      this._module.HEAP8.buffer,
      metas[3],
      metas[1] * metas[4]
    );
  }

  resize(newLength: number, autoShrink = this.autoShrinkBuffer): number {
    if (newLength < 0) newLength = 0;
    const metas = this.metas;
    const newBufferLength =
      newLength > 0 ? Math.ceil(newLength / metas[2]) * metas[2] : metas[2];

    if (
      newBufferLength > metas[1] ||
      (autoShrink && newBufferLength !== metas[1])
    ) {
      metas[3] = (<EmscriptenModuleExtended>this._module)._realloc(
        metas[3],
        newBufferLength * metas[4]
      );
      metas[1] = newBufferLength;
    }
    metas[0] = newLength;
    return metas[3];
  }

  pulled(ptr: number, index: number, length: number): void {}
  removed(ptr: number, index: number, length: number): void {}
  
  add(amount = 1): number {
    const metas = this.metas;
    const length = metas[0];
    const ptr = metas[3] + length * metas[4];
    this.resize(length + amount);
    this.pulled(ptr, length, amount);
    return ptr;
  }

  removeLast(amount = 1): number {
    const metas = this.metas;

    this.resize(metas[0] - amount);
    const ptr = metas[3] + length * metas[4];
    this.removed(ptr, metas[0], amount);
    return ptr;
  }

  reset() {
    this.resize(0, true);
  }

  destroy(freePtr: boolean = true) {
    this._module._free(this.metas[3]);
    super.destroy(freePtr);
  }
}
