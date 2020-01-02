import { wasmStruct } from '../../../wasm/decorators/classes';
import { wasmObjectAttr } from '../../../core/decorators/StructAttribute';
import { WasmPtrVector } from '../../../wasm/WasmPtrVector';
import { SceneNode } from '../../../3d/SceneNode';
import { wasmFunctionOut } from '../../../wasm/decorators/methods';
import { WasmIndexedAllocatorI } from '../../../wasm/allocators/interfaces';
import { AQueuePass } from '../../materials/AMaterial';
@wasmStruct({ methodsPrefix: 'ANodeQueuePass_' })
export abstract class ANodeQueuePass extends AQueuePass {
  @wasmObjectAttr(WasmPtrVector)
  nodesPtr: WasmPtrVector<SceneNode>;
  nodes: SceneNode[];
  @wasmFunctionOut('init')
  wasmInit: () => void;
  @wasmFunctionOut('dispose')
  wasmDispose: () => void;
  init(firstInit: boolean) {
    if (firstInit) {
      this.wasmInit();
      this.initPassWasmBinding();
      this.nodes = new Array(this.length);
    }
  }
  protected syncNodePtr() {
    const allocator = SceneNode.allocator as WasmIndexedAllocatorI<SceneNode>;
    allocator.getElements(this._module, this.nodesPtr.buffer, this.nodes);
  }
  destroy(freePtr?: boolean) {
    super.destroy(freePtr);
    this.wasmDispose();
  }
  abstract bind(): void;
  abstract apply(): void;
}
