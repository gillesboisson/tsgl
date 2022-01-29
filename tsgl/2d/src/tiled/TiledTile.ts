import { TiledObjectGroup } from './TiledObjectGroup';
import { TiledProperty } from './TiledProperty';
import { TiledFrame } from './TiledFrame';
export interface TiledTile {
  animation: TiledFrame[]; //	array	Array of Frames
  id: number; //	int	Local ID of the tile
  image?: string; //	string	Image representing this tile (optional)
  imageheight: number; //	int	Height of the tile image in pixels
  imagewidth: number; //	int	Width of the tile image in pixels
  objectgroup?: TiledObjectGroup[]; //Layer	Layer with type objectgroup, when collision shapes are specified (optional)
  probability?: number; //	double	Percentage chance this tile is chosen when competing with others in the editor (optional)
  properties: TiledProperty[]; //	array	Array of Properties
  terrain?: number[]; //	array	Index of terrain for each corner of tile (optional)
  type?: string; //	string	The type of the tile (optional)
}
