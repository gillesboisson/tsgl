import { AnyWebRenderingGLContext } from '../core/GLHelpers';
export function setupTextureSampler(
  gl: AnyWebRenderingGLContext,
  texture: WebGLTexture,
  mipmap: boolean,
  linearFilter: boolean,
  wrapMode: GLenum,
  textureType: GLenum = gl.TEXTURE_2D,
) {
  gl.bindTexture(textureType, texture);
  if (mipmap) {
    gl.texParameteri(
      textureType,
      gl.TEXTURE_MIN_FILTER,
      linearFilter ? gl.NEAREST_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST,
    );
    gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, linearFilter ? gl.LINEAR : gl.NEAREST);
    gl.generateMipmap(textureType);
  } else {
    gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, linearFilter ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, linearFilter ? gl.LINEAR : gl.NEAREST);
  }
  gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, wrapMode);
  gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, wrapMode);
  gl.bindTexture(textureType, null);
}
