import { TiledBaseLayer } from './TiledBaseLayer';
import { TiledObject } from './TiledObject';
export interface TiledObjectGroup extends TiledBaseLayer {
  draworder: string; //	string	topdown (default) or index. objectgroup only.
  objects: TiledObject[]; //	array	Array of objects. objectgroup only.
}
