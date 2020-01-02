import { GLVao } from '../../gl/core/data/GLVao';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLPass } from '../../gl/pass/IGLPass';
import { GLCore } from '../../gl/core/GLCore';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { AWasmGLPass } from '../../gl/pass/AWasmGLPass';
import { wasmStruct } from '../../wasm/decorators/classes';
import { structAttr, wasmPtrAttr } from '../../core/decorators/StructAttribute';
import { WasmPoolAllocator } from '../../wasm/allocators/WasmPoolAllocator';

export abstract class AMaterial<MaterialPassType extends AQueuePass> {
  public vao: GLVao;
  protected _renderingPass: MaterialPassType;

  constructor(protected _renderer: GLRenderer) {}

  abstract render(): void;
}

@wasmStruct({ methodsPrefix: 'QueuePass_' })
export abstract class AQueuePass extends AWasmGLPass {
  @structAttr({
    type: Uint32Array,
    length: 2,
  })
  private _metas: Uint32Array;

  get length() {
    return this._metas[0];
  }
  get ind() {
    return this._metas[1];
  }

  constructor(renderer: GLRenderer, length: number, module: EmscriptenModule) {
    super(renderer, module);
    this._metas[0] = length;
    this._metas[1] = 0;
  }
}
