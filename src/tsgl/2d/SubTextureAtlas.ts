/**
 * Group of subtexture based on the same global texture
 * @class
 */

import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLTexture2D } from '../gl/core/texture/GLTexture';
import { loadTexture2D } from '../helpers/texture/loadTexture2D';
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

/*

{ "frames": {
   "spritessheet.aseprite": {
    "frame": { "x": 0, "y": 0, "w": 384, "h": 384 },
    "rotated": false,
    "trimmed": false,
    "spriteSourceSize": { "x": 0, "y": 0, "w": 384, "h": 384 },
    "sourceSize": { "w": 384, "h": 384 },
    "duration": 100
   }
 },
 "meta": {
  "app": "http://www.aseprite.org/",
  "version": "1.2.25-x64",
  "image": "spritessheet.png",
  "format": "RGBA8888",
  "size": { "w": 384, "h": 384 },
  "scale": "1",
  "frameTags": [
  ],
  "layers": [
   { "name": "Layer 1", "opacity": 255, "blendMode": "normal" }
  ],
  "slices": [
   { "name": "ninja slice", "color": "#0000ffff", "keys": [{ "frame": 0, "bounds": {"x": 0, "y": 240, "w": 32, "h": 32 } }] },
   { "name": "ninja", "color": "#0000ffff", "keys": [{ "frame": 0, "bounds": {"x": 0, "y": 32, "w": 384, "h": 208 } }] },
   { "name": "circle", "color": "#0000ffff", "keys": [{ "frame": 0, "bounds": {"x": 0, "y": 0, "w": 32, "h": 32 } }] },
   { "name": "square", "color": "#0000ffff", "keys": [{ "frame": 0, "bounds": {"x": 32, "y": 0, "w": 32, "h": 32 } }] }
  ]
 }
}


*/

type AseSpriteRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type AseSpriteSize = {
  w: number;
  h: number;
};

type AseSpriteLayer = { name: string; opacity: number; blendMode: string };

type AseSpriteSlice = { name: string; color: string; keys: { frame: number; bounds: AseSpriteRect }[] };

type AseSpriteData = {
  frames: {
    'spritessheet.aseprite': {
      frame: AseSpriteRect;
      rotated: boolean;
      trimmed: boolean;
      spriteSourceSize: AseSpriteRect;
      sourceSize: AseSpriteSize;
      duration: number;
    };
  };
  meta: {
    app: string;
    version: string;
    image: string;
    format: string;
    size: AseSpriteSize;
    scale: string;
    frameTags: string[];
    layer: AseSpriteLayer[];
    slices: AseSpriteSlice[];
  };
};

export default class SubTextureAtlas {
  static async load(gl: AnyWebRenderingGLContext, path: string): Promise<SubTextureAtlas> {
    const jsonPath = path + '.json';
    const imgPath = path + '.png';

    return Promise.all([fetch(jsonPath).then((response) => response.json()), loadTexture2D(gl, imgPath)]).then(
      (results) => new SubTextureAtlas(results[0], results[1]),
    );
  }

  readonly subTextures: {
    [key: string]: SubTexture;
  } = {};

  constructor(readonly data: JsonAtlasData | TexturePackerAtlasData | AseSpriteData, readonly texture: GLTexture2D) {
    const isAseSprite =
      this.data.hasOwnProperty('frames') && (this.data as AseSpriteData).frames.hasOwnProperty('spritessheet.aseprite');

    if (isAseSprite) {
      this.initFromAsepriteAtlasData(data as AseSpriteData, texture);
    } else {
      this.initFromAtlasData(data as JsonAtlasData | TexturePackerAtlasData, texture);
    }
  }

  protected initFromAtlasData(data: JsonAtlasData | TexturePackerAtlasData, texture: GLTexture2D): void {
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

        let x, y, width, height;

        if (isFromTexturePacker) {
          // detect Texture packer format

          x = (textureData as TexturePackerFrame).frame.x;
          y = (textureData as TexturePackerFrame).frame.y;
          width = (textureData as TexturePackerFrame).frame.w;
          height = (textureData as TexturePackerFrame).frame.h;
        } else {
          x = (textureData as JsonAtlasFrame).x;
          y = (textureData as JsonAtlasFrame).y;
          width = (textureData as JsonAtlasFrame).width;
          height = (textureData as JsonAtlasFrame).height;
        }

        this.subTextures[textureName] = new SubTexture(texture, x, y, width, height);
      }
  }

  protected initFromAsepriteAtlasData(data: AseSpriteData, texture: GLTexture2D): void {
    const slices = data.meta.slices;

    for (const slice of slices) {
      const animated = slice.keys.length > 1;

      if (animated) {
        for (const frame of slice.keys) {
          this.subTextures[`${slice.name}-${frame.frame}`] = new SubTexture(
            texture,
            frame.bounds.x,
            frame.bounds.y,
            frame.bounds.w,
            frame.bounds.h,
          );
        }
      } else {
        this.subTextures[`${slice.name}`] = new SubTexture(
          texture,
          slice.keys[0].bounds.x,
          slice.keys[0].bounds.y,
          slice.keys[0].bounds.w,
          slice.keys[0].bounds.h,
        );
      }
    }
  }
}
