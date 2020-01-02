import { wasmStruct } from '../../../wasm/decorators/classes';
import { structAttr } from '../../../core/decorators/StructAttribute';
import { WasmClass } from '../../../wasm/WasmClass';
import { WasmAllocatorI } from '../../../wasm/allocators/interfaces';
// @glInterleavedAttributes()  // webggl attributes support
@wasmStruct({ methodsPrefix: 'NodeResult_' })
export class NodeResult extends WasmClass {
  // Static ====================================
  static byteLength: number;
  static allocator: WasmAllocatorI<NodeResult>;
  // WASM Props ====================================
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  mvp: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  model: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  rotation: Float32Array;
}
