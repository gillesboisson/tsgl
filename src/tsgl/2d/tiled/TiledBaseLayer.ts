import { TiledLayerType } from './TiledLayerType';
import { TiledProperty } from './TiledProperty';
export interface TiledBaseLayer {
  height: number; //	int	Row count. Same as map height for fixed-size maps.
  id: number; //	int	Incremental id - unique across all layers
  name: string; //	string	Name assigned to this layer
  offsetx: number; //	double	Horizontal layer offset in pixels (default: 0)
  offsety: number; //	double	Vertical layer offset in pixels (default: 0)
  opacity: number; //	double	Value between 0 and 1
  properties: TiledProperty[]; //	array	Array of Properties
  startx: number; //	int	X coordinate where layer content starts (for infinite maps)
  starty: number; //	int	Y coordinate where layer content starts (for infinite maps)
  type: TiledLayerType; //	string	tilelayer, objectgroup, imagelayer or group
  visible: boolean; //	bool	Whether layer is shown or hidden in editor
  width: number; //	int	Column count. Same as map width for fixed-size maps.
  x: number; //	int	Horizontal layer offset in tiles. Always 0.
  y: number; //	int	Vertical layer offset in tiles. Always 0.
}
