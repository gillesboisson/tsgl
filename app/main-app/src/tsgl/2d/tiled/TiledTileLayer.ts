import { TiledBaseLayer } from './TiledBaseLayer';
import { TiledChunk } from './TiledChunk';
export interface TiledTileLayer extends TiledBaseLayer {
  chunks?: TiledChunk[]; //	array	Array of chunks (optional). tilelayer only.
  compression: string; //	string	zlib, gzip or empty (default). tilelayer only.
  data: number[]; //	array or string	Array of unsigned int (GIDs) or base64-encoded data. tilelayer only.
  encoding: string; //	string	csv (default) or base64. tilelayer only.
}
