import { wasmStruct } from '../../../wasm/decorators/classes';
import { structAttr } from '../../../core/decorators/StructAttribute';
import { WasmBuffer } from '../../../wasm/WasmBuffer';
import { NodeResult } from './NodeResult';
import { ANodeQueuePass } from './ANodeQueuePass';
@wasmStruct({ methodsPrefix: 'NodeQueuePass_' })
export class NodePass extends ANodeQueuePass {
  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  private _resultPtr: number;
  private _result: WasmBuffer<NodeResult>;
  init(firstInit: boolean) {
    super.init(firstInit);
    this._result = new WasmBuffer({
      length: this.length,
      wasmType: NodeResult,
    });
    this._resultPtr = this._result.ptr;
  }
  destroy(freePtr: boolean) {
    this._result.destroy;
    this._resultPtr = 0;
    super.destroy(freePtr);
    delete this._resultPtr;
  }
  bind(): void {
    throw new Error('Method not implemented.');
  }
  apply(): void {
    this.syncNodePtr;
  }
}
