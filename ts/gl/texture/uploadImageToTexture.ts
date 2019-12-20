import { AnyWebRenderingGLContext } from '../core/GLHelpers';
export function uploadImageToTexture(
  gl: AnyWebRenderingGLContext,
  texture: WebGLTexture,
  image: HTMLImageElement | HTMLCanvasElement | ArrayBufferView | ImageData | ImageBitmap | HTMLVideoElement,
  format: GLenum,
  type: GLenum = gl.UNSIGNED_BYTE,
  generateMipmap: boolean = false,
  textureType: GLenum = gl.TEXTURE_2D,
) {
  {
    gl.bindTexture(textureType, texture);
    gl.texImage2D(textureType, 0, format, format, type, image as any);
    if (generateMipmap) gl.generateMipmap(textureType);
    gl.bindTexture(textureType, null);
  }
}
