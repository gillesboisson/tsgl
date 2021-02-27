import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLTexture } from '../../gl/core/GLTexture';

const EXT_DEFAULT_ALPHA = ['png', 'gif'];

export function createMipmapTextureProxy(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number,
): {
  width: number;
  height: number;
  levels: number;
  textures: IGLTexture[];
} {
  const textures = new Array(levels);
  for (let level = 0; level < levels; level++) {
    const tWidth = width / Math.pow(2, level); // size / 2 every iteration = size / pow(2,level)
    const tHeight = height / Math.pow(2, level);

    const { texture } = createEmptyTextureWithLinearFilter(gl, tWidth, tHeight);

    textures[level] = {
      width: tWidth,
      height: tHeight,
      level,
      texture,
    };
  }

  return {
    width,
    height,
    levels,
    textures,
  };
}

export function createEmptyTextureWithLinearFilter(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): IGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return { texture, width, height };
}

export function createImageTextureWithLinearFilter(gl: WebGL2RenderingContext, image: any): IGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return { texture, width: image.width, height: image.height };
}

export function createFBAndFlippableTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): { width: number; height: number; texture1: WebGLTexture; texture2: WebGLTexture; framebuffer: WebGLFramebuffer } {
  const { texture: texture1 } = createEmptyTextureWithLinearFilter(gl, width, height);
  const { texture: texture2 } = createEmptyTextureWithLinearFilter(gl, width, height);

  const framebuffer = gl.createFramebuffer();

  return {
    width,
    height,
    texture1,
    texture2,
    framebuffer,
  };
}

export function createEmptyMipmapTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number,
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

export function createMipmapTextureForStorage(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number,
): IGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texStorage2D(gl.TEXTURE_2D, levels, gl.RGBA8, width, height);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    texture,
    width,
    height,
    levels,
  };
}

export function createCubemapEmptyTexture(
  gl: AnyWebRenderingGLContext,
  size: number,
  internalFormat: GLenum = gl.RGBA,
  format: GLenum = internalFormat,
  type: GLenum = gl.UNSIGNED_BYTE,
): {
  cubemap: WebGLTexture,
  size: number,
  format: GLenum,
  internalFormat: GLenum,
  type: GLenum,
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


export function createCubemapMipmapStorageTexture(
  gl: WebGL2RenderingContext,
  size: number,
  levels: number,
  internalFormat: GLenum = gl.RGBA,
  type: GLenum = gl.UNSIGNED_BYTE,
): {
  cubemap: WebGLTexture,
  size: number,
  levels: number,
  internalFormat: GLenum,
  type: GLenum,
} {
  const cubemap = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);

  // create empty space in all faces (RGB / FLOAT)
  for (let i = 0; i < 6; i++) {
    gl.texStorage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,levels,internalFormat,size,size);
  }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return {
    cubemap,
    size,
    internalFormat,
    type,
    levels,
  };
}