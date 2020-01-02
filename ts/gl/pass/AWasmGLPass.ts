import { WasmClass } from '../../wasm/WasmClass';
import { IGLPass } from './IGLPass';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLRenderer } from '../core/GLRenderer';
import { structAttr } from '../../core/decorators/StructAttribute';
import { wasmStruct } from '../../wasm/decorators/classes';
import { wasmFunctionOut } from '../../wasm/decorators/methods';
import { WasmClassBinder } from '../../wasm/WasmClassBinder';

const binder = new WasmClassBinder<AWasmGLPass>({
  RenderPass_wasmBind: (element: any, ...args: any) => element.bind(...args),
  RenderPass_wasmApply: (element: any, ...args: any) => element.apply(...args),
});

// console.log(window);

@wasmStruct({ methodsPrefix: 'RenderPass_' })
export abstract class AWasmGLPass extends WasmClass {
  @structAttr({
    type: Uint32Array,
    length: 2,
  })
  protected _cMethodsDelegate: Uint32Array;

  @wasmFunctionOut('initDefaultMethodsBinding')
  initDefaultWasmBinding: () => void;

  protected gl: AnyWebRenderingGLContext;
  constructor(protected renderer: GLRenderer, module?: EmscriptenModule) {
    super(module);
    this.gl = renderer.getGL();
    binder.add(this);
  }

  getGL() {
    return this.gl;
  }

  destroy(destroyPtr?: boolean) {
    binder.remove(this);
    super.destroy(destroyPtr);
  }

  // prepare: PrepareF;
  // apply: ApplyF;
}
