export interface TiledWangColor {
  color: string; // string	Hex-formatted color (#RRGGBB or #AARRGGBB)
  name: string; //	string	Name of the Wang color
  probability: number; //	double	Probability used when randomizing
  tile: number; //	int	Local ID of tile representing the Wang color
}
