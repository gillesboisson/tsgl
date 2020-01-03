import { wasmStruct } from '../../../wasm/decorators/classes';
import { structAttr } from '../../../core/decorators/StructAttribute';
import { WasmBuffer } from '../../../wasm/WasmBuffer';
import { NodeResult } from './NodeResult';
import { ANodeQueuePass } from './ANodeQueuePass';
import { EmscriptenModuleExtended } from '../../../wasm/EmscriptenModuleLoader';
import { BaseRenderer } from '../Renderer';
import { wasmFunctionOut } from '../../../wasm/decorators/methods';
@wasmStruct({ methodsPrefix: 'NodeQueuePass_' })
export class NodePass extends ANodeQueuePass {
  // Wasm props ------------------------------------------------------------------------------------
  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  private _resultPtr: number;

  // Wasm methods ------------------------------------------------------------------------------------

  @wasmFunctionOut('initDefaultPullFunction')
  initDefaultPullFunction: () => void;

  // Props ------------------------------------------------------------------------------------

  private _result: WasmBuffer<NodeResult>;

  // Methods ------------------------------------------------------------------------------------

  constructor(renderer: BaseRenderer, length: number, module: EmscriptenModule) {
    super(renderer, length, module);
    this._result = new WasmBuffer({
      length,
      wasmType: NodeResult,
      module: this._module as EmscriptenModuleExtended,
    });
    this._resultPtr = this._result.ptr;
  }

  init(firstInit: boolean): void {
    super.init(firstInit);
    if (firstInit) {
      this.initDefaultPullFunction();
    }
  }

  destroy(freePtr: boolean) {
    this._result.destroy();
    this._resultPtr = 0;
    super.destroy(freePtr);
    delete this._resultPtr;
    delete this._result;
  }
  bind(): void {
    throw new Error('Method not implemented.');
  }
  apply(): void {
    console.log('> Apply');
  }
}
