import { AnyWebRenderingGLContext } from './GLHelpers';
import { IDestroy } from "../../base/IDestroy";
export interface IGLCore extends IDestroy {
  readonly gl: AnyWebRenderingGLContext;
}
