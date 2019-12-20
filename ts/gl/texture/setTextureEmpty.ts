import { AnyWebRenderingGLContext } from '../core/GLHelpers';
export function setTextureEmpty(
  gl: AnyWebRenderingGLContext,
  texture: WebGLTexture,
  width: number,
  height: number,
  format: GLenum,
  type: GLenum = gl.UNSIGNED_INT,
  textureType: GLenum = gl.TEXTURE_2D,
) {
  gl.bindTexture(textureType, texture);
  gl.texImage2D(textureType, 0, format, width, height, 0, format, type, null);
  gl.bindTexture(textureType, null);
}
