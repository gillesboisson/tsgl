import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D, GLTextureCubemap } from '../../gl/core/texture/GLTexture';

export function createCubemapEmptyTexture(
  gl: AnyWebRenderingGLContext,
  size: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE,
): GLTextureCubemap {
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
    size,
    format,
    internalFormat,
    type,
  });
}
