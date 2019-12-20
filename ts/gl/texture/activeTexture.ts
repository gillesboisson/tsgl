import { AnyWebRenderingGLContext } from '../core/GLHelpers';
export function activeTexture(
  gl: AnyWebRenderingGLContext,
  texture: WebGLTexture,
  index: number,
  textureType: GLenum = gl.TEXTURE_2D,
) {
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(textureType, texture);
}
