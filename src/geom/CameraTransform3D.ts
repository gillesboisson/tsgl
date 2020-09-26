import { Transform3D } from './Transform3D';
import { mat4, vec2, vec3 } from 'gl-matrix';

const IDENT_MAT4 = mat4.create();
const tv = vec3.create();

export class CameraTransform3D extends Transform3D {
  protected updateLocalMat() {
    vec3.negate(tv, this._position);
    Transform3D.translateScaleRotateQuat(this._localMat, this._scale, this._rotation, tv, this._rotMat);
    this._dirty = false;
  }
}
