import { TiledProperty } from './TiledProperty';
import { TiledWangSet } from './TiledWangSet';
import { TiledTerrain } from './TiledTerrain';
import { TiledTile } from './TiledTile';
import { TiledOffset } from './TiledOffset';
import { TiledGrid } from './TiledGrid';
export interface TiledTileSet {
  backgroundcolor: string; //	string	Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
  columns: number; //	int	The number of tile columns in the tileset
  firstgid: number; //	int	GID corresponding to the first tile in the set
  grid?: TiledGrid; //	(optional)
  image: string; //	string	Image used for tiles in this set
  imageheight: number; //	int	Height of source image in pixels
  imagewidth: number; //	int	Width of source image in pixels
  margin: number; //	int	Buffer between image edge and first tile (pixels)
  name: string; //	string	Name given to this tileset
  properties: TiledProperty[]; //	array	Array of Properties
  source: string; //	string	The external file that contains this tilesets data
  spacing: number; //	int	Spacing between adjacent tiles in image (pixels)
  terrains?: TiledTerrain[]; //	array	Array of Terrains (optional)
  tilecount: number; //	int	The number of tiles in this tileset
  tiledversion: string; //	string	The Tiled version used to save the file
  tileheight: number; //	int	Maximum height of tiles in this set
  tileoffset?: TiledOffset; //	Tile Offset	(optional)
  tiles?: TiledTile[]; //	array	Array of Tiles (optional)
  tilewidth: number; //	int	Maximum width of tiles in this set
  transparentcolor: string; //	string	Hex-formatted color (#RRGGBB) (optional)
  type: string; //	string	tileset (for tileset files, since 1.0)
  version: number; //	number	The JSON format version
  wangsets: TiledWangSet[]; //	array	Array of Wang sets (since 1.1.5)
}
