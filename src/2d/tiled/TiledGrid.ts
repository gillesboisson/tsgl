import { TiledOrientation } from './TiledOrientation';
export interface TiledGrid {
  height: number; //	int	Cell height of tile grid
  orientation: TiledOrientation; //	string	orthogonal (default) or isometric
  width: string; //	int	Cell width of tile grid
}
