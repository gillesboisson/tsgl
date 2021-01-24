import { AnyWebRenderingGLContext } from './GLHelpers';
import { IGLCore } from './IGLCore';

export enum GLType {
  Buffer = 0,
  Texture = 1,
  Vao = 2,
  Shader = 3,
}
export abstract class GLCore implements IGLCore {
  readonly glType: GLType;

  constructor(protected gl: AnyWebRenderingGLContext) {}
  getGL(): AnyWebRenderingGLContext {
    return this.gl;
  }

  abstract destroy(): void;
}
