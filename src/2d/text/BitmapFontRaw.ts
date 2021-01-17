import { SubTexture } from '../SubTexture';

export interface BitmapFontRaw {
  raw: Float32Array;
  readonly baseFontSize: number;
  readonly baseLineHeight: number;
  readonly texture: SubTexture;
}

export const fontDataStride = 12;
