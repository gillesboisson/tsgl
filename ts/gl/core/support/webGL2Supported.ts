import { AnyWebRenderingGLContext } from '../GLHelpers';
export function webGL2Supported(gl: AnyWebRenderingGLContext) {
  return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
}
