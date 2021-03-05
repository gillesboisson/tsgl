import { IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';

export function createEmptyTextureWithLinearFilter(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat = gl.RGBA,
  format = gl.RGBA,
  type = gl.UNSIGNED_BYTE,
): IGLTexture & { internalFormat: GLenum; format: GLenum; type: GLenum } {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;

  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, internalFormat, width, height, 0, format, type, null);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    target,
    gl,
    texture,
    width,
    height,
    internalFormat,
    format,
    type,
  });
}
