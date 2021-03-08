import { bindableTexture } from '../../gl/core/texture/bindableTexture.1';
import { GLTexture2D, GLTexture2DBase, IGLTextureLevelBase, IGLTexture } from '../../gl/core/texture/GLTexture';
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
  textures: (GLTexture2D & IGLTextureLevelBase)[];
} {
  const textures: (GLTexture2D & { level: number})[] = new Array(levels);
  for (let level = 0; level < levels; level++) {
    const tWidth = width / Math.pow(2, level); // size / 2 every iteration = size / pow(2,level)
    const tHeight = height / Math.pow(2, level);

    const { texture, internalFormat, type, target } = createEmptyTextureWithLinearFilter(gl, tWidth, tHeight);

    const t: GLTexture2D & {level: number} =  bindableTexture<GLTexture2DBase & IGLTextureLevelBase>({
      type,
      target,
      gl,
      internalFormat,
      width: tWidth,
      height: tHeight,
      level,
      texture,
    });

    textures[level] = t;
  } 
  

  return {
    width, 
    height,
    levels,
    textures,
  };
}
