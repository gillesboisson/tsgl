import { GLRenderer, GLRendererType } from '../../gl/core/GLRenderer';
import { AnyWebGLVertexArrayObject } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { AQueuePass } from './pass/AQueuePass';
import { wasmObjectAttr } from '../../core/decorators/StructAttribute';
import { WasmPtrVector } from '../../wasm/WasmPtrVector';

import { QueuePassCollection } from './pass/QueuePassCollection';

export const MAX_ELEMENT_PER_QUEUES = 128;

export class BaseRenderer<QueuePassType extends AQueuePass = AQueuePass> extends GLRenderer {
  // Props ------------------------------------------------------------------------------------

  protected _renderPass: { [name: string]: QueuePassType };
  public queuePass: QueuePassCollection<QueuePassType>;

  // Methods ------------------------------------------------------------------------------------

  constructor(gl: AnyWebRenderingGLContext, type: GLRendererType, canvas: HTMLCanvasElement) {
    super(gl, type, canvas);
  }
}
