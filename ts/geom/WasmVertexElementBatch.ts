import { WasmClass, WasmClassType } from '../wasm/WasmClass';
import { wasmStruct } from '../wasm/decorators/classes';
import { WasmAllocatorI } from '../wasm/allocators/interfaces';
import { structAttr } from '../core/decorators/StructAttribute';
import { EmscriptenModuleExtended } from '../wasm/EmscriptenModuleLoader';
import { wasmFunctionOut } from '../wasm/decorators/methods';
import { IInterleaveData } from '../gl/data/IInterleaveData';
import { InterleavedDataType } from '../gl/data/InterleavedData';
import { WasmClassBinder } from '../wasm/WasmClassBinder';

export type BatchPullFunction<T> = (
  vertexInd: number,
  collection: T[],
  indexInd: number,
  indexBuffer: Uint16Array,
) => void;

const binder = new WasmClassBinder<WasmVertexElementBatch<any>>({
  VertexElementBatch_wasmPush: (element, ptr) => element.push(),
});

// @glInterleavedAttributes()  // webggl attributes support
@wasmStruct({ methodsPrefix: 'VertexElementBatch_' })
export class WasmVertexElementBatch<T extends IInterleaveData> extends WasmClass {
  // Static ====================================

  static byteLength: number;
  static allocator: WasmAllocatorI<WasmVertexElementBatch<any>>;
  // static createAttributes(gl: AnyWebRenderingGLContext,buffer: GLBuffer,stride: number = target.byteLength): GLAttributes[] // webgl attributes support

  // WASM Props ====================================

  @structAttr({
    type: Uint32Array,
    length: 8,
  })
  private _metas: Uint32Array;

  private _vertexBuffer: Uint8Array;
  private _indexBuffer: Uint16Array;
  private _vertexCollection: T[];

  // WASM methods ====================================

  @wasmFunctionOut('initForWasm', ['number', 'number', 'number'])
  private initForWasm: (vertexLength: number, indexLength: number, stride: number) => void;

  @wasmFunctionOut('dispose')
  private dispose: () => void;

  // Props ====================================

  // Static ====================================

  // Accessors ====================================

  get vertexPtr(): number {
    return this._metas[0];
  }

  get indexPtr(): number {
    return this._metas[1];
  }

  get vertexInd(): number {
    return this._metas[2];
  }
  get indexInd(): number {
    return this._metas[3];
  }

  get stride(): number {
    return this._metas[4];
  }

  get vertexLength(): number {
    return this._metas[5];
  }

  get indexLength(): number {
    return this._metas[6];
  }

  get pushFuncPtr(): number {
    return this._metas[7];
  }

  get vertexCollection(): T[] {
    return this._vertexCollection;
  }

  get indexBuffer(): Uint16Array {
    return this._indexBuffer;
  }
  get vertexBuffer(): Uint8Array {
    return this._vertexBuffer;
  }

  // Methods ====================================

  constructor(
    protected _vertexType: InterleavedDataType<T>,
    vertexLength: number,
    indexLength: number,
    module?: EmscriptenModule,
  ) {
    super(module);
    const metas = this._metas;
    const finalModule = this._module;
    const stride = _vertexType.byteLength;

    this.initForWasm(vertexLength, indexLength, stride);

    this._vertexBuffer = new Uint8Array(finalModule.HEAP16.buffer, metas[0], metas[4] * metas[5]);
    this._indexBuffer = new Uint16Array(finalModule.HEAP16.buffer, metas[1], metas[6] / Uint8Array.BYTES_PER_ELEMENT);
    const vertexCollection = (this._vertexCollection = new Array(vertexLength));
    const buffer = finalModule.HEAP16.buffer;
    for (let i = 0; i < vertexLength; i++) {
      const v = new _vertexType();
      v.allocate(buffer, metas[0] + stride * i, stride);
      vertexCollection[i] = v;
    }

    binder.add(this);
    // batches[this.ptr.toString()] = this;
  }

  end(): void {
    const metas = this._metas;
    if (metas[2] > 0 || metas[3] > 0) {
      this.push();
      metas[2] = 0;
      metas[3] = 0;
    }
  }

  begin(): void {
    this._metas[2] = 0;
    this._metas[3] = 0;
  }

  pull(nbVertex: number, nbIndices: number, pull: BatchPullFunction<T>) {
    const metas = this._metas;
    if (metas[2] + nbVertex >= metas[5] || metas[3] + nbIndices >= metas[6]) {
      this.push();
      metas[2] = 0;
      metas[3] = 0;
    }

    pull(metas[2], this._vertexCollection, metas[3], this._indexBuffer);
    metas[2] += nbVertex;
    metas[3] += nbIndices;
  }

  push() {
    throw new Error('not implemented');
  }

  destroy(freePtr?: boolean) {
    binder.remove(this);
    this.dispose();

    this._vertexCollection.splice(0);
    super.destroy(freePtr);
    delete this._vertexBuffer;
    delete this._indexBuffer;
    delete this._vertexCollection;
  }
}
