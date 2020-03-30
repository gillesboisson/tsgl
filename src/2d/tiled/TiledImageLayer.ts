import { TiledBaseLayer } from './TiledBaseLayer';
export interface TiledImageLayer extends TiledBaseLayer {
  image: string; //	string	Image used by this layer. imagelayer only.
  transparentcolor?: string; //	string	Hex-formatted color (#RRGGBB) (optional). imagelayer only.
}
