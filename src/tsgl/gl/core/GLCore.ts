import { AnyWebRenderingGLContext } from './GLHelpers';
import { IGLCore } from './IGLCore';

export enum GLType {
  Buffer = 0,
  Texture = 1,
  Vao = 2,
  Shader = 3,
}
export abstract class GLCore<GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext> implements IGLCore<GLContext> {
  readonly glType: GLType;
  

  constructor(readonly gl: GLContext) {}
  

  abstract destroy(): void;
}
