// export function createCubemapMipmapEmptyTexture(
//   gl: WebGL2RenderingContext,
//   size: number,
//   internalFormat?: GLenum,
//   format?: GLenum,
//   type?: GLenum
// ): {
//   cubemap: WebGLTexture;
//   size: number;
//   internalFormat: GLenum;
//   type: GLenum;
// } {
//   const cubemap = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);

import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import {
  GLTextureCubemap,
  IGLStoredTextureBase,
  IGLTextureBase,
  IGLTextureCubemapSize,
  IGLTextureLodBase,
} from '../../gl/core/texture/GLTexture';

//   // create empty space in all faces (RGB / FLOAT)
//   for (let i = 0; i < 6; i++) {
//     gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, size, size, 0, format, type, null);

//   }

//   gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
//   gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//   gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

//   return {
//     cubemap,
//     size,
//     internalFormat,
//     type
//   };
// }

export function createCubemapMipmapEmptyTexture(
  gl: WebGL2RenderingContext,
  size: number,
  levels: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE,
): GLTextureCubemap & IGLTextureLodBase {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_CUBE_MAP;

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  gl.texStorage2D(gl.TEXTURE_CUBE_MAP, levels, internalFormat, size, size);
  // create empty space in all faces (RGB / FLOAT)
  // for (let i = 0; i < 6; i++) {
  //   gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, internalFormat, size, size, 0, format, type, null);

  // }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    gl,
    target,
    internalFormat,
    texture,
    size,
    format,
    type,
    levels,
  });
}
