import { TiledWangColor } from './TiledWangColor';
export interface TiledWangTile {
  dflip: boolean; //	bool	Tile is flipped diagonally (default: false)
  hflip: boolean; //	bool	Tile is flipped horizontally (default: false)
  tileid: number; //	int	Local ID of tile
  vflip: number; //	bool	Tile is flipped vertically (default: false)
  wangid: TiledWangColor[]; //	array	Array of Wang color indexes (uchar[8])
}
