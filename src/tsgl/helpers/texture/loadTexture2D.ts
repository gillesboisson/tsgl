import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLTexture } from '../../gl/core/GLTexture';
import { bindableTexture } from './bindableTexture';
import { createImageTextureWithLinearFilter } from './createImageTextureWithLinearFilter';

const EXT_DEFAULT_ALPHA = ['png', 'gif'];

export async function loadTexture2D(
  gl: AnyWebRenderingGLContext,
  url: string,
  type?: GLenum,
  mipmap = false,
): Promise<IGLTexture & {mipmap: boolean}> {
  const finalType =
    type !== undefined ? type : EXT_DEFAULT_ALPHA.indexOf(url.split('.').pop().toLowerCase()) !== -1 ? gl.RGBA : gl.RGB;

  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((image) => {
      const texture = gl.createTexture();
      const target = gl.TEXTURE_2D;
      gl.bindTexture(target, texture);
      gl.texImage2D(target, 0, finalType, finalType, gl.UNSIGNED_BYTE, image as any);

      gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      if (mipmap) gl.generateMipmap(target);

      return bindableTexture({ gl, texture, width: image.width, height: image.height, target, mipmap });
    });
}
