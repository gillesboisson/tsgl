import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { SubTexture } from '../SubTexture';
import { BitmapFontRaw, fontDataStride } from './BitmapFontRaw';

export default class BitmapFont implements BitmapFontRaw {
  info: { [key: string]: string | number | boolean };
  common: { [key: string]: string | number | boolean };
  raw: Float32Array;
  /**
   * @param {AnyWebRenderingGLContext} gl
   * @param {string} path
   * @param {function} onLoad
   * @param {SubTexture} subTexture
   */
  static async load(gl: AnyWebRenderingGLContext, path: string, subTexture: SubTexture = null): Promise<BitmapFont> {
    const texturePath = path + '.png';
    const fontPath = path + '.fnt';

    const loadFnt = (subTexture: SubTexture) => {
      return fetch(fontPath)
        .then((response) => response.text())
        .then((text) => new BitmapFont(this.parseFontFile(text, subTexture), subTexture));
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

  /**
   * @param {string} fontString
   * @param {SubTexture} texture
   * @returns {{}}
   */
  static parseFontFile(fontString: string, texture: SubTexture): BitmapFontData {
    const lines = fontString.split(/\n/g);
    let spl = null;
    let charIndex = 0;
    let lineType = '';
    let count = 0;

    let raw;
    const data: Partial<BitmapFontData> = {};

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
          data.info = parseLine(spl);
          break;
        case 'common':
          data.common = parseLine(spl);
          break;
        case 'chars':
          count = parseLine(spl).count;
          raw = new Float32Array(count * fontDataStride);
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

    return data as BitmapFontData;
  }

  /**
   * @param {Object} data
   * @param {SubTexture} texture
   */
  constructor(data: BitmapFontData, readonly texture: SubTexture) {
    this.info = data.info;
    this.common = data.common;
    this.raw = data.raw;
  }
}

export interface BitmapFontData {
  info: { [key: string]: number | string | boolean };
  common: { [key: string]: number | string | boolean };
  raw: Float32Array;
}
