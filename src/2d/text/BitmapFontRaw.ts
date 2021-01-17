import { SubTexture } from '../SubTexture';

export type BitmapFontInfo = {
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

export type BitmapFontCommon = {
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

export interface BitmapFontRaw {
  raw: Float32Array;
  readonly baseFontSize: number;
  readonly baseLineHeight: number;
  readonly texture: SubTexture;
  readonly kernings: Int16Array;
}

export const fontDataStride = 12;
export const kerningDataStride = 3;
