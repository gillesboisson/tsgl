import { AnyWebRenderingGLContext } from './GLHelpers';
import { IDestroyable } from '../../pool/Pool';
export interface IGLCore extends IDestroyable {
  readonly gl: AnyWebRenderingGLContext;
}
