import { IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';

export function createImageTextureWithLinearFilter(gl: WebGL2RenderingContext, image: ImageBitmap): IGLTexture {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;
  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({gl, texture, width: image.width, height: image.height, target });
}
