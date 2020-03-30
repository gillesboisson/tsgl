import { TiledProperty } from './TiledProperty';
import { TiledWangTile } from './TiledWangTile';
import { TiledWangColor } from './TiledWangColor';
export interface TiledWangSet {
  cornercolors: TiledWangColor[]; //	array	Array of Wang colors
  edgecolors: TiledWangColor[]; //	array	Array of Wang colors
  name: string; //	string	Name of the Wang set
  properties: TiledProperty[]; //	array	Array of Properties
  tile: number; //	int	Local ID of tile representing the Wang set
  wangtiles: TiledWangTile[]; //	array	Array of Wang tiles
}
