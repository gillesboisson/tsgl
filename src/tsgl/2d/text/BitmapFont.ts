import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { SubTexture } from '../SubTexture';
import { BitmapFontCommon, BitmapFontInfo, BitmapFontRaw, fontDataStride, kerningDataStride } from './BitmapFontRaw';
import { MSDFFontJSON } from './MSDFFontJSON';

export default class BitmapFont implements BitmapFontRaw {
  info: BitmapFontInfo;
  common: BitmapFontCommon;
  raw: Float32Array;
  readonly kernings: Int16Array;

  static async loadJson(
    gl: AnyWebRenderingGLContext,
    path: string,
    subTexture: SubTexture = null,
  ): Promise<BitmapFont> {
    const texturePath = path + '.png';
    const fontPath = path + '.json';

    const loadFnt = (subTexture: SubTexture) => {
      return fetch(fontPath)
        .then((response) => response.json())
        .then((json) => new BitmapFont(this.parseJson(json, subTexture), subTexture));
    };

    if (subTexture === null) {
      return SubTexture.load(gl, texturePath).then((subTexture) => loadFnt(subTexture));
    } else return loadFnt(subTexture);
  }

  static async loadFnt(gl: AnyWebRenderingGLContext, path: string, subTexture: SubTexture = null): Promise<BitmapFont> {
    const texturePath = path + '.png';
    const fontPath = path + '.fnt';

    const loadFnt = (subTexture: SubTexture) => {
      return fetch(fontPath)
        .then((response) => response.text())
        .then((text) => new BitmapFont(this.parseFnt(text, subTexture), subTexture));
    };

    if (subTexture === null) {
      return SubTexture.load(gl, texturePath).then((subTexture) => loadFnt(subTexture));
    } else return loadFnt(subTexture);
  }

  get baseFontSize(): number {
    return this.info.size as number;
  }

  get baseLineHeight(): number {
    return this.common.lineHeight as number;
  }

  static parseJson(data: MSDFFontJSON, texture: SubTexture): BitmapFontData {
    let charIndex = 0;
    let kerningIndex = 0;

    const tOX = texture.uv[0]; // sub texture left offset
    const tOY = texture.uv[1]; // sub texture top offset
    const mtX = texture.glTexture.width; // global texture width
    const mtY = texture.glTexture.height; // global texture height

    const raw = new Float32Array(data.chars.length * fontDataStride);
    const kernings = new Int16Array(data.kernings.length);
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

    for (const kerning of data.kernings) {
      kernings[kerningIndex] = kerning.first;
      kernings[kerningIndex + 1] = kerning.second;
      kernings[kerningIndex + 2] = kerning.amount;
      kerningIndex += kerningDataStride;
    }

    return {
      raw,
      kernings,
      common: data.common,
      info: data.info,
    };
  }

  static parseFnt(fontString: string, texture: SubTexture): BitmapFontData {
    const lines = fontString.split(/\n/g);
    let spl = null;
    let charIndex = 0;
    let kerningIndex = 0;
    let lineType = '';
    let count = 0;
    let raw;
    const data: Partial<BitmapFontData> = {};
    let kernings: Int16Array;
    let kerningCount = 0;

    // get sub texture uvs data in order to converter font uvs
    const tOX = texture.uv[0]; // sub texture left offset
    const tOY = texture.uv[1]; // sub texture top offset
    const mtX = texture.glTexture.width; // global texture width
    const mtY = texture.glTexture.height; // global texture height

    function parseLine(spl: string[]) {
      const lineData: {
        [key: string]: number;
      } = {};

      let attrSpl = null;

      for (const attr of spl) {
        attrSpl = attr.split('=');
        if (attrSpl.length < 2) continue;
        const val = attrSpl[1].split('"').join('') as any;
        lineData[attrSpl[0]] = isNaN(val * 1) ? val : val * 1;
      }

      return lineData;
    }

    for (const line of lines) {
      spl = line.split(' ');
      lineType = spl.shift();

      switch (lineType) {
        case 'info':
          data.info = parseLine(spl) as any;
          break;
        case 'common':
          data.common = parseLine(spl) as any;
          break;
        case 'chars':
          count = parseLine(spl).count;
          raw = new Float32Array(count * fontDataStride);
          break;

        case 'kernings':
          kerningCount = parseLine(spl).count;
          kernings = new Int16Array(kerningCount * kerningDataStride);
          break;
        case 'kerning':
          const kerningData = parseLine(spl);
          kernings[kerningIndex] = kerningData.first;
          kernings[kerningIndex + 1] = kerningData.second;
          kernings[kerningIndex + 2] = kerningData.amount;
          kerningIndex += kerningDataStride;
          break;
        case 'char':
          const charData = parseLine(spl);
          raw[charIndex] = charData.id;
          raw[charIndex + 1] = charData.xoffset;
          raw[charIndex + 2] = charData.yoffset;
          raw[charIndex + 3] = charData.xadvance;
          raw[charIndex + 4] = charData.x;
          raw[charIndex + 5] = charData.y;
          raw[charIndex + 6] = charData.width;
          raw[charIndex + 7] = charData.height;
          raw[charIndex + 8] = tOX + charData.x / mtX;
          raw[charIndex + 9] = tOY + charData.y / mtY;
          raw[charIndex + 10] = tOX + (charData.x + charData.width) / mtX;
          raw[charIndex + 11] = tOY + (charData.y + charData.height) / mtY;
          charIndex += fontDataStride;
      }
    }

    data.raw = raw;
    data.kernings = kernings;

    return data as BitmapFontData;
  }

  constructor(data: BitmapFontData, readonly texture: SubTexture) {
    this.info = data.info as BitmapFontInfo;
    this.common = data.common as BitmapFontCommon;
    this.raw = data.raw;
    this.kernings = data.kernings;
  }
}

export interface BitmapFontData {
  info: BitmapFontInfo;
  common: BitmapFontCommon;
  raw: Float32Array;
  kernings: Int16Array;
}
