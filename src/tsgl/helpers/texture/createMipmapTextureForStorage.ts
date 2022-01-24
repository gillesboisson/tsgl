import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D } from '../../gl/core/texture/GLTexture';

export function createMipmapTextureForStorage(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number,
): GLTexture2D {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;
  const internalFormat = gl.RGBA8;

  gl.bindTexture(target, texture);
  gl.texStorage2D(target, levels, internalFormat, width, height);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    internalFormat,
    mipmap: false,
    texture,
    width,
    height,
    levels,
    gl,
    target,
  });
}
