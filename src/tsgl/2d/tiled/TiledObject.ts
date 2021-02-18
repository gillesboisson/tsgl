import { TiledProperty } from './TiledProperty';
import { TiledPoint } from './TiledPoint';
import { TiledText } from './TiledText';
export interface TiledObject {
  ellipse: boolean; // bool	Used to mark an object as an ellipse
  gid: number; //	int	Global tile ID, only if object represents a tile
  height: number; //	double	Height in pixels.
  id: number; //	int	Incremental id, unique across all objects
  name: string; //	string	String assigned to name field in editor
  point: boolean; //	bool	Used to mark an object as a point
  polygon: TiledPoint[]; //	array	Array of Points, in case the object is a polygon
  polyline: TiledPoint[]; //	array	Array of Points, in case the object is a polyline
  properties: TiledProperty[]; //	array	Array of Properties
  rotation: number; //	double	Angle in degrees clockwise
  template: string; //	string	Reference to a template file, in case object is a template instance
  text: TiledText; //	Text	Only used for text objects
  type: string; //	string	String assigned to type field in editor
  visible: boolean; //	bool	Whether object is shown in editor.
  width: number; //	double	Width in pixels.
  x: number; //	double	X coordinate in pixels
  y: number; //	double	Y coordinate in pixels
}
