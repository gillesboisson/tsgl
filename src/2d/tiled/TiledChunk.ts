export interface TiledChunk {
  data: string[]; //	array or string	Array of unsigned int (GIDs) or base64-encoded data
  height: number; //	int	Height in tiles
  width: number; //	int	Width in tiles
  x: number; //	int	X coordinate in tiles
  y: number; //	int	Y coordinate in tiles
}
