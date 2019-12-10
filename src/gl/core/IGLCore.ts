import { AnyWebRenderingGLContext } from './GLHelpers';
import { IDestroyable } from '../../pool/Pool';
export interface IGLCore extends IDestroyable {
  getGL(): AnyWebRenderingGLContext;
}
