import { GLFramebuffer } from '../../tsgl/gl/core/framebuffer/GLFramebuffer';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLTexture } from '../../tsgl/gl/core/GLTexture';


const EXT_DEFAULT_ALPHA = ['png', 'gif'];

export async function createMipmapMax(gl: WebGL2RenderingContext, url: string, type?: GLenum): Promise<{ texture: WebGLTexture, width: number, height: number, type: GLenum }> {

  const finalType =
    type !== undefined
      ? type
      : EXT_DEFAULT_ALPHA.indexOf(url.split('.').pop().toLowerCase()) !== -1
        ? gl.RGBA
        : gl.RGB;

  const image = await fetch(url)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob));



  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, finalType, finalType, gl.UNSIGNED_BYTE, image as any);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_NEAREST,
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.NEAREST,
  );


  gl.generateMipmap(gl.TEXTURE_2D);


  return {
    texture,
    width: image.width,
    height: image.height,
    type: finalType,
  }
}

export function createEmptyTextureWithLinearFilter(gl: WebGL2RenderingContext, width: number, height: number): { width: number, height: number, texture: WebGLTexture } {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR,
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.LINEAR,
  );

  return { texture, width, height }
}

export function createImageTextureWithLinearFilter(gl: WebGL2RenderingContext, image: any): { width: number, height: number, texture: WebGLTexture } {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image as any);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR,
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.LINEAR,
  );

  return { texture, width: image.width, height: image.height }
}

export function createFBAndFlippableTexture(gl: WebGL2RenderingContext, width: number, height: number): { width: number, height: number, texture1: WebGLTexture, texture2: WebGLTexture, framebuffer: WebGLFramebuffer } {
  const { texture: texture1 } = createEmptyTextureWithLinearFilter(gl, width, height);
  const { texture: texture2 } = createEmptyTextureWithLinearFilter(gl, width, height);

  const framebuffer = gl.createFramebuffer();

  return {
    width,
    height,
    texture1,
    texture2,
    framebuffer,
  }

}


export function createMimapMapFbs(gl: WebGL2RenderingContext, width: number, height: number, levels = 4) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texStorage2D(gl.TEXTURE_2D, levels, gl.RGBA8, width, height);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.LINEAR,
  );

  const framebuffers = [];
  for (let level = 0; level < levels; ++level) {
    const fb = gl.createFramebuffer();
    framebuffers.push(fb);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D, texture, level);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return {
    levels,
    width,
    height,
    texture,
    framebuffers
  }

}
