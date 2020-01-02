import { GLRenderer, GLRendererType } from '../../gl/core/GLRenderer';
import { AnyWebGLVertexArrayObject } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';

export class Renderer extends GLRenderer {
  constructor(gl: AnyWebRenderingGLContext, type: GLRendererType, canvas: HTMLCanvasElement) {
    super(gl, type, canvas);
  }
}
