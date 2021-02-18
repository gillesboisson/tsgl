import { TiledOrientation } from './TiledOrientation';
import { TiledProperty } from './TiledProperty';
import { TiledTileSet } from './TiledTileSet';
import { TiledLayer } from './TiledLayer';
export interface TiledMap {
  backgroundcolor: string; //	string	Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
  height: number; //	int	Number of tile rows
  hexsidelength: number; //	int	Length of the side of a hex tile in pixels (hexagonal maps only)
  infinite: boolean; //	bool	Whether the map has infinite dimensions
  layers: TiledLayer[]; //	array	Array of Layers
  nextlayerid: number; // int	Auto-increments for each layer
  nextobjectid: number; //	int	Auto-increments for each placed object
  orientation: TiledOrientation; //	string	orthogonal, isometric, staggered or hexagonal
  properties: TiledProperty[]; //	array	Array of Properties
  renderorder: string; //	string	right-down (the default), right-up, left-down or left-up (orthogonal maps only)
  staggeraxis: string; //	string	x or y (staggered / hexagonal maps only)
  staggerindex: string; //	string	odd or even (staggered / hexagonal maps only)
  tiledversion: string; //	string	The Tiled version used to save the file
  tileheight: number; //	int	Map grid height
  tilesets: TiledTileSet; //	array	Array of Tilesets
  tilewidth: number; //	int	Map grid width
  type: string; //	string	map (since 1.0)
  version: number; //	number	The JSON format version
  width: number; //	int	Number of tile columns
}
