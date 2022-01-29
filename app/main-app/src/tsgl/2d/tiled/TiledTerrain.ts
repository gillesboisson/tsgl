import { TiledProperty } from './TiledProperty';
export interface TiledTerrain {
  name: string; //	string	Name of terrain
  properties: TiledProperty[]; //	array	Array of Properties
  tile: number; //	int	Local ID of tile representing terrain
}
