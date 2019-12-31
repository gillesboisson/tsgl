import { WasmClass, WasmClassType } from '../wasm/WasmClass';
import { wasmStruct } from '../wasm/decorators/classes';
import { WasmAllocatorI } from '../wasm/allocators/interfaces';
import { structAttr } from '../core/decorators/StructAttribute';
import { EmscriptenModuleExtended } from '../wasm/EmscriptenModuleLoader';
import { wasmFunctionOut } from '../wasm/decorators/methods';

const batches: { [ptr: string]: WasmVertexElementBatch<any> } = {};

export type BatchPullFunction<T> = (
  vertexInd: number,
  collection: T[],
  indexInd: number,
  indexBuffer: Uint16Array,
) => void;

// @glInterleavedAttributes()  // webggl attributes support
@wasmStruct({ methodsPrefix: 'VertexElementBatch_' })
export class WasmVertexElementBatch<T extends WasmClass> extends WasmClass {
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

  // Methods ====================================

  constructor(
    protected _vertexType: WasmClassType<T>,
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
    for (let i = 0; i < vertexLength; i++) {
      vertexCollection[i] = new _vertexType(finalModule, metas[0] + stride * i, true);
    }
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

  push: () => void;

  destroy(freePtr?: boolean) {
    this.dispose();

    const vertexLength = this._metas[5];
    for (let i = 0; i < vertexLength; i++) {
      this._vertexCollection[i].destroy(false);
    }
    this._vertexCollection.splice(0);
    super.destroy(freePtr);
    delete this._vertexBuffer;
    delete this._indexBuffer;
    delete this._vertexCollection;
  }
}
