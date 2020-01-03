import { GLRenderer } from '../../../gl/core/GLRenderer';
import { AWasmGLPass } from '../../../gl/pass/AWasmGLPass';
import { wasmStruct } from '../../../wasm/decorators/classes';
import { structAttr } from '../../../core/decorators/StructAttribute';
import { BaseRenderer } from '../Renderer';
import { wasmFunctionOut } from '../../../wasm/decorators/methods';
@wasmStruct({ methodsPrefix: 'QueuePass_' })
export abstract class AQueuePass extends AWasmGLPass {
  // Wasm props ------------------------------------------------------------------------------------
  @structAttr({
    type: Uint32Array,
    length: 2,
  })
  private _metas: Uint32Array;

  // Wasm function ------------------------------------------------------------------------------------

  @wasmFunctionOut('print')
  wasmPrint: () => void;

  // Accessors ------------------------------------------------------------------------------------

  get length() {
    return this._metas[0];
  }

  get ind() {
    return this._metas[1];
  }

  // Methods ------------------------------------------------------------------------------------

  constructor(renderer: BaseRenderer, length: number, module: EmscriptenModule) {
    super(renderer, module);
    this._metas[0] = length;
    this._metas[1] = 0;
  }

  // Abstract ------------------------------------------------------------------------------------

  abstract apply(): void;
}
