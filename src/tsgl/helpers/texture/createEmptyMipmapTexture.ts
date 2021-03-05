import { IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';


export function createEmptyMipmapTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number
): IGLTexture {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;
 
  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

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
    texture,
    width,
    height,
    levels,
    gl,
    target,
  });
}
