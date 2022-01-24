import { IResize } from '../../../base/IResize';
import { createRawFramebuffer } from '../../../helpers/framebuffer';
import { createEmptyTextureWithLinearNearestFilter } from '../../../helpers/texture/createEmptyTextureWithLinearNearestFilter';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLTexture2D } from '../texture/GLTexture';
import { IGLFrameBuffer } from './IGLFrameBuffer';

/**
 * Create a resizable framebuffer atteched to a single RGBD / UNSIGNED_BYTE color texture
 * @param gl Rendering Context
 * @param width
 * @param height
 * @returns structured object with framebuffer and texture
 */
export function createSimpleResizableFramebuffer(
  gl: AnyWebRenderingGLContext,
  width: number,
  height: number,
): { texture: GLTexture2D; framebuffer: IGLFrameBuffer & IResize } {
  // create base objects
  const texture = createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
  const rawFB = createRawFramebuffer(gl, width, height);

  // get raw webgl data
  const fb = rawFB.framebuffer;
  const tex = texture.texture;
  const target = gl.TEXTURE_2D;

  // link texture to framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // custom resize function which resize texture and update framebuffer settings
  function resize(width: number, height: number): void {
    gl.bindTexture(target, tex);
    gl.texImage2D(target, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(target, null);
    rawFB.width = width;
    rawFB.height = height;
  }

  // create final objects
  return {
    framebuffer: {
      ...rawFB,
      resize,
    },
    texture,
  };
}
