import { SceneInstance3D } from './SceneInstance3D';
import { Transform3D } from '../geom/Transform3D';
import { mat4 } from 'gl-matrix';
import { CameraTransform3D } from '../geom/CameraTransform3D';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tmat4 = mat4.create();

export class Camera extends SceneInstance3D<CameraTransform3D> {
  protected _projectionMat: mat4 = mat4.create();
  protected _vpMat: mat4 = mat4.create();
  protected _invertWorldMap = mat4.create();
  protected _dirtyVP = true;

  static createOrtho(left: number, right: number, bottom: number, top: number, near?: number, far?: number): Camera {
    const cam = new Camera();
    cam.setOrtho(left, right, bottom, top, near, far);
    return cam;
  }

  static create2D(width: number, height: number, near?: number, far?: number): Camera {
    const cam = new Camera();
    cam.setDimension2d(width, height, near, far);
    return cam;
  }

  static createPerspective(fovy: number, aspect: number, near?: number, far?: number): Camera {
    const cam = new Camera();
    cam.setPerspective(fovy, aspect, near, far);
    return cam;
  }

  protected constructor() {
    super(CameraTransform3D);
  }

  setOrtho(left: number, right: number, bottom: number, top: number, near = 0.001, far = 100): void {
    mat4.ortho(this._projectionMat, left, right, bottom, top, near, far);
    this._dirtyVP = true;
  }

  setDimension2d(width: number, height: number, near = 0.001, far = 100): void {
    mat4.ortho(this._projectionMat, 0, width, height, 0, near, far);
    this._dirtyVP = true;
  }

  setPerspective(fovy: number, aspect: number, near = 0.001, far = 100): void {
    mat4.perspective(this._projectionMat, fovy, aspect, near, far);
    this._dirtyVP = true;
  }

  protected updateWorldMat(parentMap: mat4 = null, worldMat?: mat4): mat4 {
    const wm = super.updateWorldMat(parentMap, worldMat);

    mat4.invert(this._invertWorldMap, wm);
    return wm;
  }

  vp(out: mat4): void {
    // if (this._dirtyVP) {
    mat4.multiply(this._vpMat, this._projectionMat, this._invertWorldMap);
    this._dirtyVP = false;
    // }
    mat4.copy(out, this._vpMat);
  }

  mvp(out: mat4, modelMat: mat4): void {
    // if (this._dirtyVP) {
    mat4.multiply(this._vpMat, this._projectionMat, this._invertWorldMap);
    this._dirtyVP = false;
    // }
    mat4.multiply(out, this._vpMat, modelMat);
  }

  normalMat(out: mat4, modelMat: mat4): mat4 {
    mat4.invert(out, modelMat);
    mat4.transpose(out, out);
    return out;
  }

  mv(out: mat4, modelMat: mat4, cachedWorldMat = true): void {
    mat4.multiply(out, cachedWorldMat ? this._worldMat : this.calcWorldMat(), modelMat);
  }
}
