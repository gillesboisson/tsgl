import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';

export function createFramebufferWithDepthStorage(
  gl: AnyWebRenderingGLContext,
  width: number,
  height: number,
  depthInternalFormat = gl.DEPTH_COMPONENT,
): {
  framebuffer: WebGLFramebuffer;
  depthRenderBuffer: WebGLRenderbuffer;
  width: number;
  height: number;
  depthInternalFormat: GLenum;
} {
  const framebuffer = gl.createFramebuffer();
  const depthRenderBuffer = gl.createRenderbuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  // gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
  // gl.renderbufferStorage(gl.RENDERBUFFER, depthInternalFormat, width, height);
  // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
  // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return {
    framebuffer,
    depthInternalFormat,
    depthRenderBuffer,
    width,
    height,
  };
}
