import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D } from '../../gl/core/texture/GLTexture';

const EXT_DEFAULT_ALPHA = ['png', 'gif'];

export async function loadTexture2D(
  gl: AnyWebRenderingGLContext,
  url: string,
  format?: GLenum,
  mipmap = false,
): Promise<GLTexture2D> {
  const finalFormat =
    format !== undefined
      ? format
      : EXT_DEFAULT_ALPHA.indexOf(url.split('.').pop().toLowerCase()) !== -1
      ? gl.RGBA
      : gl.RGB;
  const type = gl.UNSIGNED_BYTE;
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((image) => {
      const texture = gl.createTexture();
      const target = gl.TEXTURE_2D;
      gl.bindTexture(target, texture);
      gl.texImage2D(target, 0, finalFormat, finalFormat, type, image as any);

      gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      if (mipmap) gl.generateMipmap(target);

      return bindableTexture({
        gl,
        texture,
        width: image.width,
        height: image.height,
        target,
        mipmap,
        format: finalFormat,
        internalFormat: finalFormat,
        type,
      });
    });
}
