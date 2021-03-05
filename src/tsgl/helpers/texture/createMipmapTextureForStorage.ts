import { IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';


export function createMipmapTextureForStorage(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number
): IGLTexture {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;


  gl.bindTexture(target, texture);
  gl.texStorage2D(target, levels, gl.RGBA8, width, height);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    texture,
    width,
    height,
    levels,
    gl,
    target,
  });
}
