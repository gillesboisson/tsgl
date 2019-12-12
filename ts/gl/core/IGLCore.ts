import { AnyWebRenderingGLContext } from './GLHelpers';
import { IDestroy } from '../../core/IDestroy';
export interface IGLCore extends IDestroy {
  getGL(): AnyWebRenderingGLContext;
}
