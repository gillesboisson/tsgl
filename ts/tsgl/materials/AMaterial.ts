import { GLVao } from '../../gl/core/data/GLVao';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLPass } from '../../gl/pass/IGLPass';
import { GLCore } from '../../gl/core/GLCore';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { wasmPtrAttr, wasmObjectAttr } from '../../core/decorators/StructAttribute';
import { WasmPoolAllocator } from '../../wasm/allocators/WasmPoolAllocator';
import { WasmClass } from '../../wasm/WasmClass';
import { WasmAllocatorI } from '../../wasm/allocators/interfaces';
import { AQueuePass } from '../renderer/pass/AQueuePass';
import { BaseRenderer } from '../renderer/Renderer';

export abstract class AMaterial<QueuePassType extends AQueuePass> {
  public vao: GLVao;

  private _renderingPass: QueuePassType;

  get renderingPass(): QueuePassType {
    return this._renderingPass;
  }

  // set renderingPass(val: QueuePassType) {
  //   if (this._renderingPass !== val) {
  //     this._renderingPass = val;
  //   }
  // }

  constructor(protected _renderer: BaseRenderer, renderingPass: QueuePassType) {
    this._renderingPass = renderingPass;
  }

  abstract render(): void;
}
