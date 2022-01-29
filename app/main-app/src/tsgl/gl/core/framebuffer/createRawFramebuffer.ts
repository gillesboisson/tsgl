import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IGLFrameBuffer } from './IGLFrameBuffer';



export function createRawFramebuffer(
  gl: AnyWebRenderingGLContext,
  width: number,
  height: number,
  framebuffer: WebGLFramebuffer = gl.createFramebuffer()
): IGLFrameBuffer {
  return {
    framebuffer,
    width,
    height,
    unbind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    },
  };
}
