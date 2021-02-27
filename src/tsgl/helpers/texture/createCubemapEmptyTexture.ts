import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';


export function createCubemapEmptyTexture(
  gl: AnyWebRenderingGLContext,
  size: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE
): {
  cubemap: WebGLTexture;
  size: number;
  format: GLenum;
  internalFormat: GLenum;
  type: GLenum;
} {
  const cubemap = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);

  // create empty space in all faces (RGB / FLOAT)
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, size, size, 0, format, type, null);
  }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    cubemap,
    size,
    format,
    internalFormat,
    type,
  };
}
