import { createEmptyTextureWithLinearFilter } from './createEmptyTextureWithLinearFilter';

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
