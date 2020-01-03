import { wasmStruct } from '../../../wasm/decorators/classes';
import { wasmObjectAttr, structAttr } from '../../../core/decorators/StructAttribute';
import { WasmPtrVector } from '../../../wasm/WasmPtrVector';
import { SceneNode } from '../../../3d/SceneNode';
import { wasmFunctionOut } from '../../../wasm/decorators/methods';
import { WasmIndexedAllocatorI } from '../../../wasm/allocators/interfaces';
import { AQueuePass } from './AQueuePass';

@wasmStruct({ methodsPrefix: 'ANodeQueuePass_' })
export abstract class ANodeQueuePass extends AQueuePass {
  // Wasm Props ------------------------------------------------------------------------------------

  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  pushMethodPtr: number;

  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  nodesPtr: number;

  // Props ------------------------------------------------------------------------------------

  nodesPtrBuffer: Uint32Array;
  nodes: SceneNode[];

  // Methods ------------------------------------------------------------------------------------

  init(firstInit: boolean) {
    if (firstInit) {
      this.initPassWasmBinding();
      this.nodesPtr = this._module._malloc(Uint32Array.BYTES_PER_ELEMENT * this.length);
      this.nodesPtrBuffer = new Uint32Array(this._module.HEAP32.buffer, this.nodesPtr, this.length);
      this.nodes = new Array(this.length);
    }
  }

  protected syncNodePtr() {
    const allocator = SceneNode.allocator as WasmIndexedAllocatorI<SceneNode>;
    allocator.getElements(this._module, this.nodesPtrBuffer, this.nodes);
  }

  destroy(freePtr?: boolean) {
    this._module._free(this.nodesPtr);
    delete this.nodes;
    delete this.nodesPtrBuffer;
    super.destroy(freePtr);
  }

  // Abstract  ------------------------------------------------------------------------------------

  abstract bind(): void;
}
