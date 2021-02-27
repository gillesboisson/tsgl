import { IGLTexture } from '../../gl/core/GLTexture';
import { createEmptyTextureWithLinearFilter } from './createEmptyTextureWithLinearFilter';


export function createMipmapTextureProxy(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  levels: number
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
