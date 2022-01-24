import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D, IGLTexture } from '../../gl/core/texture/GLTexture';

export function createEmptyMipmapTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE,
): GLTexture2D {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;

  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, internalFormat, width, height, 0, format, type, null);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // gl.texParameteri(
  //   target,
  //   gl.TEXTURE_BASE_LEVEL,
  //   levels,
  // );
  gl.generateMipmap(target);

  return bindableTexture({
    internalFormat,
    format,
    type,
    texture,
    width,
    height,
    mipmap: true,
    gl,
    target,
  });
}
