import { TiledHAlign } from './TiledHAlign';
import { TiledVAlign } from './TiledVAlign';
export interface TiledText {
  bold: boolean; //	bool	Whether to use a bold font (default: false)
  color: string; //	string	Hex-formatted color (#RRGGBB or #AARRGGBB) (default: #000000)
  fontfamily: string; //	string	Font family (default: sans-serif)
  halign: TiledHAlign; //	string	Horizontal alignment (center, right, justify or left (default))
  italic: boolean; //	bool	Whether to use an italic font (default: false)
  kerning: boolean; //	bool	Whether to use kerning when placing characters (default: true)
  pixelsize: number; //	int	Pixel size of font (default: 16)
  strikeout: boolean; //	bool	Whether to strike out the text (default: false)
  text: string; //	string	Text
  underline: boolean; //	bool	Whether to underline the text (default: false)
  valign: TiledVAlign; //	string	Vertical alignment (center, bottom or top (default))
  wrap: boolean; //	bool	Whether the text is wrapped within the object bounds (default: false)
}
