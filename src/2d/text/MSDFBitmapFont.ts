import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { SubTexture } from '../SubTexture';
import { BitmapFontRaw } from './BitmapFontRaw';
const fontDataStride = 12;

export type MSDFFontJSONInfo = {
  face: string;
  size: number;
  bold: number;
  italic: number;
  charset: string[];
  unicode: number;
  stretchH: number;
  smooth: number;
  aa: number;
  padding: number[];
  spacing: number[];
};

export type MSDFFontJSONCommon = {
  lineHeight: number;
  base: number;
  scaleW: number;
  scaleH: number;
  pages: number;
  packed: number;
  alphaChnl: number;
  redChnl: number;
  greenChnl: number;
  blueChnl: number;
};

export type MSDFFontJSON = {
  pages: string[];
  chars: {
    id: number;
    index: number;
    char: string;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    chnl: number;
    x: number;
    y: number;
    page: number;
  }[];
  info: MSDFFontJSONInfo;
  common: MSDFFontJSONCommon;
  distanceField: {
    fieldType: string;
    distanceRange: number;
  };
  kernings: number[];
};

export default class MSDFBitmapFont implements BitmapFontRaw {
  info: MSDFFontJSONInfo;
  common: MSDFFontJSONCommon;
  raw: Float32Array;

  static async load(
    gl: AnyWebRenderingGLContext,
    path: string,
    subTexture: SubTexture = null,
  ): Promise<MSDFBitmapFont> {
    const texturePath = path + '.png';
    const fontPath = path + '.json';

    const loadFnt = (subTexture: SubTexture) => {
      return fetch(fontPath)
        .then((response) => response.json())
        .then((json) => new MSDFBitmapFont(json, subTexture));
    };

    if (subTexture === null) {
      return SubTexture.load(gl, texturePath).then((subTexture) => loadFnt(subTexture));
    } else return loadFnt(subTexture);
  }

  constructor(data: MSDFFontJSON, readonly texture: SubTexture) {
    this.info = data.info;
    this.common = data.common;

    this.updateRawData(data);

    //this.raw = data.raw;
  }

  get baseFontSize(): number {
    return this.info.size;
  }
  get baseLineHeight(): number {
    return this.common.lineHeight;
  }

  updateRawData(data: MSDFFontJSON): void {
    let charIndex = 0;

    const tOX = this.texture.uv[0]; // sub texture left offset
    const tOY = this.texture.uv[1]; // sub texture top offset
    const mtX = this.texture.glTexture.width; // global texture width
    const mtY = this.texture.glTexture.height; // global texture height

    const raw = (this.raw = new Float32Array(data.chars.length * fontDataStride));

    for (const char of data.chars) {
      raw[charIndex] = char.id;
      raw[charIndex + 1] = char.xoffset;
      raw[charIndex + 2] = char.yoffset;
      raw[charIndex + 3] = char.xadvance;
      raw[charIndex + 4] = char.x;
      raw[charIndex + 5] = char.y;
      raw[charIndex + 6] = char.width;
      raw[charIndex + 7] = char.height;
      raw[charIndex + 8] = tOX + char.x / mtX;
      raw[charIndex + 9] = tOY + char.y / mtY;
      raw[charIndex + 10] = tOX + (char.x + char.width) / mtX;
      raw[charIndex + 11] = tOY + (char.y + char.height) / mtY;

      charIndex += fontDataStride;
    }
  }
}
