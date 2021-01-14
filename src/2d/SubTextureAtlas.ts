/**
 * Group of subtexture based on the same global texture
 * @class
 */

import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLTexture } from '../gl/core/GLTexture';
import { SubTexture } from './SubTexture';

type TexturePackerFrame = {
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  sourceSize: {
    w: number;
    h: number;
  };
  pivot: {
    x: number;
    y: number;
  };
};

type TexturePackerAtlasData = {
  frames: {
    [key: string]: TexturePackerFrame;
  };
};

type JsonAtlasFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type JsonAtlasData = {
  atlas: { [key: string]: JsonAtlasFrame };
};

export default class SubTextureAtlas {
  static async load(gl: AnyWebRenderingGLContext, path: string): Promise<SubTextureAtlas> {
    const jsonPath = path + '.json';
    const imgPath = path + '.png';

    return Promise.all([fetch(jsonPath).then((response) => response.json()), GLTexture.load(gl, imgPath)]).then(
      (results) => new SubTextureAtlas(results[0], results[1]),
    );
  }

  readonly subTextures: {
    [key: string]: SubTexture;
  } = {};

  constructor(readonly data: JsonAtlasData | TexturePackerAtlasData, readonly texture: GLTexture) {
    let textureName;
    const isFromTexturePacker = this.data.hasOwnProperty('frames');

    const cleanFrame = isFromTexturePacker ? (data as TexturePackerAtlasData).frames : (data as JsonAtlasData).atlas;

    for (const textureNameFile in cleanFrame)
      if (cleanFrame.hasOwnProperty(textureNameFile)) {
        if (isFromTexturePacker) {
          const spl = textureNameFile.split('.');
          spl.pop();
          textureName = spl.join('.');
        } else {
          textureName = textureNameFile;
        }

        const textureData = cleanFrame[textureNameFile];

        let l, t, r, b;

        if (isFromTexturePacker) {
          // detect Texture packer format

          l = (textureData as TexturePackerFrame).frame.x / texture.width;
          t = (textureData as TexturePackerFrame).frame.y / texture.height;
          r =
            ((textureData as TexturePackerFrame).frame.x + (textureData as TexturePackerFrame).frame.w) / texture.width;
          b =
            ((textureData as TexturePackerFrame).frame.y + (textureData as TexturePackerFrame).frame.h) /
            texture.height;
        } else {
          l = (textureData as JsonAtlasFrame).x / texture.width;
          t = (textureData as JsonAtlasFrame).y / texture.height;
          r = ((textureData as JsonAtlasFrame).x + (textureData as JsonAtlasFrame).width) / texture.width;
          b = ((textureData as JsonAtlasFrame).y + (textureData as JsonAtlasFrame).height) / texture.height;
        }

        this.subTextures[textureName] = new SubTexture(texture, l, t, r - l, b - t);
      }
  }
}
