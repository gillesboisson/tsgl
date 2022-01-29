import { TiledBaseLayer } from './TiledBaseLayer';
import { TiledLayer } from './TiledLayer';
export interface TiledGroup extends TiledBaseLayer {
  layers: TiledLayer[]; //	array	Array of layers. group only.
}
