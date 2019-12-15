import { Transform, translateScaleRotateQuat, DirtyFlag } from './Transform';
import { vec3, mat4 } from 'gl-matrix';

const __tempV: vec3 = vec3.create();

export class CamTransform extends Transform {
  protected _projectionMat: mat4;
  protected _ortho: boolean = false;

  constructor() {
    super();
    this._projectionMat = mat4.create();
    this.dirty |= DirtyFlag.Frustrum;
  }

  perspective(fovY: number, aspect: number, near = 0.001, far = 100): CamTransform {
    mat4.perspective(this._projectionMat, fovY, aspect, near, far);
    this.dirty |= DirtyFlag.Frustrum;
    this._ortho = false;
    return this;
  }

  ortho(left: number, right = left, bottom = left, top = bottom, near = 0.001, far = 100) {
    mat4.ortho(this._projectionMat, left, right, bottom, top, near, far);
    this.dirty |= DirtyFlag.Frustrum;
    this._ortho = true;

    return this;
  }

  sprite(width: number, height: number, near = 0.001, far = 100) {
    mat4.ortho(this._projectionMat, 0, width, height, 0, near, far);
    this.dirty |= DirtyFlag.Frustrum;
    this._ortho = true;
  }

  public mvp(modelMat: mat4, out: mat4) {
    mat4.multiply(out, this.worldMat, modelMat);
  }

  protected updateLocalMat() {
    vec3.negate(__tempV, this.position);
    translateScaleRotateQuat(this.localMat, this.scale, this.rotation, __tempV, this.rotMat);
    this.dirty &= ~DirtyFlag.Local;
  }
}
