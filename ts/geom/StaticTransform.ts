import { translateScaleRotateQuat } from './Transform';
import { WasmTransform } from './WasmTransform';
import { vec3, quat, mat4 } from 'gl-matrix';

export class StaticTransform extends WasmTransform {
  set(position: vec3, scale: vec3, rotation: quat) {
    vec3.copy(this._position, position);
    vec3.copy(this._scale, scale);
    quat.copy(this._rotation, rotation);

    translateScaleRotateQuat(this.localMat, scale, rotation, position, this.rotMat);
  }

  getLocalMat(): mat4 {
    return this.localMat;
  }
}
