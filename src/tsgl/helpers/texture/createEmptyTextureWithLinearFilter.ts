import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D } from '../../gl/core/texture/GLTexture';

export function createEmptyTextureWithLinearFilter(
  gl: AnyWebRenderingGLContext,
  width: number,
  height: number,
  internalFormat = gl.RGBA,
  format = internalFormat,
  type = gl.UNSIGNED_BYTE,
): GLTexture2D {
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
    mipmap: false,
    internalFormat,
    format,
    type,
  });
}
