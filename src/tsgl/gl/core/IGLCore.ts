import { IDestroy } from '../../core';
import { AnyWebRenderingGLContext } from './GLHelpers';
export interface IGLCore<GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext> extends IDestroy {
  readonly gl: GLContext;
}
