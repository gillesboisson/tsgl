import { GLDefaultTextureLocation } from '@tsgl/gl';
import { IGLTexture } from '@tsgl/gl';
import { ProcessPassTextureLocation } from "./ProcessPassTextureLocation";

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
