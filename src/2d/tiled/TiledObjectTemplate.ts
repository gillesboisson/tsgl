import { TiledObject } from './TiledObject';
import { TiledTileSet } from './TiledTileSet';
export interface TiledObjectTemplate {
  type: string; //	string	template
  tileset?: TiledTileSet; //	Tileset	External tileset used by the template (optional)
  object?: TiledObject; //	Object	The object instantiated by this template
}
