import { IResize } from '../../../core';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { bindableTexture } from './bindableTexture.1';
import { GLTexture2D } from './GLTexture';

export function createTexture2D(
  gl: AnyWebRenderingGLContext,
  settings: {
    width: number;
    height: number;
    internalFormat: number; // texture internal format eg. gl.RGBA16,
    format: number; // texture format eg gl.RGNA
    type: number; // texture type eg. gl.FLOAT
    paramsI: Array<{ paramIndex: number; paramValue: number }>;
    paramsF: Array<{ paramIndex: number; paramValue: number }>;
    mipmap?: boolean;
  },
): GLTexture2D {
  const target = gl.TEXTURE_2D;
  const texture = gl.createTexture();
  settings.mipmap = !!settings.mipmap;

  gl.bindTexture(target, texture);
  gl.texImage2D(
    target,
    0,
    settings.internalFormat,
    settings.width,
    settings.height,
    0,
    settings.format,
    settings.type,
    null,
  );

  if (settings.mipmap) gl.generateMipmap(target);

  settings.paramsI.forEach((param) => gl.texParameteri(target, param.paramIndex, param.paramValue));
  settings.paramsF.forEach((param) => gl.texParameterf(target, param.paramIndex, param.paramValue));

  return bindableTexture({ ...settings, texture, gl, target });
}

export function resizableTexture<T extends GLTexture2D>(texture: GLTexture2D & T): T & GLTexture2D & IResize {
  return {
    ...texture,
    resize(width: number, height: number): void {
      texture.gl.texImage2D(
        texture.gl.TEXTURE_2D,
        0,
        texture.internalFormat,
        width,
        height,
        0,
        texture.format,
        texture.type,
        null,
      );

      texture.width = width;
      texture.height = height;
    },
  };
}

export function createEmptyTextureWithLinearFilter(
  gl: AnyWebRenderingGLContext,
  width: number,
  height: number,
  internalFormat = gl.RGBA,
  format = internalFormat,
  type = gl.UNSIGNED_BYTE,
): GLTexture2D {
  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;

  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, internalFormat, width, height, 0, format, type, null);

  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return bindableTexture({
    target,
    gl,
    texture,
    width,
    height,
    mipmap: false,
    internalFormat,
    format,
    type,
  });
}
