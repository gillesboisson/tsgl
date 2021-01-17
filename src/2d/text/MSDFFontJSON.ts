import { BitmapFontCommon, BitmapFontInfo } from './BitmapFontRaw';

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
  info: BitmapFontInfo;
  common: BitmapFontCommon;
  distanceField: {
    fieldType: string;
    distanceRange: number;
  };
  kernings: { first: number; second: number; amount: number }[];
};
