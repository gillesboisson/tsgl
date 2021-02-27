import { IGLTexture } from '../../gl/core/GLTexture';

export function createEmptyTextureWithLinearFilter(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat = gl.RGBA,
  format = gl.RGBA,
  type = gl.UNSIGNED_BYTE,
): IGLTexture & { internalFormat: GLenum; format: GLenum; type: GLenum } {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return { texture, width, height, internalFormat, format, type };
}
