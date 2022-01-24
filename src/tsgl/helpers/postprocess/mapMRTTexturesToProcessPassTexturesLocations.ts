import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { ProcessPassTextureLocation } from './PostProcessPass';

export function mapMRTTexturesToProcessPassTexturesLocations(
  mrt: { textures: IGLTexture[]; depthTexture?: IGLTexture },
  textureLocation: GLint[],
): ProcessPassTextureLocation[] {
  const map = mrt.textures.map<ProcessPassTextureLocation>((t, ind) => ({
    texture: t.texture,
    location: textureLocation[ind],
  }));

  if (mrt.depthTexture) {
    map.push({
      texture: mrt.depthTexture.texture,
      location: GLDefaultTextureLocation.DEPTH,
    });
  }

  return map;
}
