import { AnyWebRenderingGLContext } from './GLHelpers';
import { IGLCore } from './IGLCore';

export abstract class GLCore implements IGLCore {
  constructor(protected gl: AnyWebRenderingGLContext) {}
  getGL(): AnyWebRenderingGLContext {
    return this.gl;
  }

  abstract destroy(): void;
}
