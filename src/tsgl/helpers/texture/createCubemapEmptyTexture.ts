import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLStoredTexture, IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';

export function createCubemapEmptyTexture(
  gl: AnyWebRenderingGLContext,
  size: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE,
): IGLTexture & IGLStoredTexture {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_CUBE_MAP;

  gl.bindTexture(target, texture);
  // create empty space in all faces (RGB / FLOAT)
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, size, size, 0, format, type, null);
  }

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    gl,
    target,
    texture,
    width: size,
    height: size,
    format,
    internalFormat,
    type,
  });
}
