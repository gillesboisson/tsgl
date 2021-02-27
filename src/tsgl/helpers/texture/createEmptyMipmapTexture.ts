import { IGLTexture } from '../../gl/core/GLTexture';


export function createEmptyMipmapTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number
): IGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // gl.texParameteri(
  //   gl.TEXTURE_2D,
  //   gl.TEXTURE_BASE_LEVEL,
  //   levels,
  // );
  gl.generateMipmap(gl.TEXTURE_2D);

  return {
    texture,
    width,
    height,
    levels,
  };
}
