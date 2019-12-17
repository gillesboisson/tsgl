import { WasmClass } from './wasm/WasmClass';
import { mat4 } from 'gl-matrix';
import { structAttr } from './core/decorators/StructAttribute';
import { wasmStruct } from './wasm/decorators/classes';
import { WasmAllocatorI } from './wasm/allocators/interfaces';
@wasmStruct()
export class WasmSceneNodeResult extends WasmClass {
  static byteLength: number;
  static allocator: WasmAllocatorI<WasmSceneNodeResult>;
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  mvp: mat4;
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  mv: mat4;
  @structAttr({
    type: Float32Array,
    length: 16,
  })
  rot: mat4;
}
