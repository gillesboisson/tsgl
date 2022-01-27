import { AnyWebRenderingGLContext } from '../GLHelpers';
import { bindableTexture } from './bindableTexture.1';
import { GLTexture2D } from './GLTexture';


export function createEmptyTextureWithLinearNearestFilter(
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
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

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
