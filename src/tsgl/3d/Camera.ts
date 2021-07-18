import { SceneInstance3D } from './SceneInstance3D';
import { mat4 } from 'gl-matrix';
import { CameraTransform3D } from '../geom/CameraTransform3D';
import { Type } from '../base/Type';
import { ITransform } from '../gl/abstract/ITransform';
import { TranslateRotateTransform3D } from '../geom/TranslateRotateTransform3D';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tmat4 = mat4.create();

export class Camera<TransformT extends ITransform<mat4> = CameraTransform3D> extends SceneInstance3D<TransformT> {
  readonly projectionMat: mat4 = mat4.create();
  readonly vpMat: mat4 = mat4.create();
  readonly invertWorldMat = mat4.create();
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

  constructor(TransformClass: Type<TransformT> = (TranslateRotateTransform3D as unknown) as Type<TransformT>) {
    super(TransformClass);
  }


  

  setOrtho(left: number, right: number, bottom: number, top: number, near = 0.001, far = 100): Camera<TransformT> {
    mat4.ortho(this.projectionMat, left, right, bottom, top, near, far);
    this._dirtyVP = true;
    return this;
  }

  setDimension2d(width: number, height: number, near = 0.001, far = 100): Camera<TransformT> {
    mat4.ortho(this.projectionMat, 0, width, height, 0, near, far);
    this._dirtyVP = true;
    return this;
  }

  setPerspective(fovy: number, aspect: number, near = 0.001, far = 100): Camera<TransformT> {
    mat4.perspective(this.projectionMat, fovy, aspect, near, far);
    this._dirtyVP = true;
    return this;
  }

  protected updateWorldMat(parentMap: mat4 = null, worldMat?: mat4): mat4 {
    const wm = super.updateWorldMat(parentMap, worldMat);

    mat4.invert(this.invertWorldMat, wm);
    return wm;
  }

  vp(out: mat4): void {
    // if (this._dirtyVP) {
    mat4.multiply(this.vpMat, this.projectionMat, this.invertWorldMat);
    this._dirtyVP = false;
    // }
    mat4.copy(out, this.vpMat);
  }

  mvp(out: mat4, modelMat: mat4): void {
    // if (this._dirtyVP) {
    mat4.multiply(this.vpMat, this.projectionMat, this.invertWorldMat);
    this._dirtyVP = false;
    // }
    mat4.multiply(out, this.vpMat, modelMat);
  }

  v(out: mat4): void {
    mat4.copy(out, this.invertWorldMat);
  }
  p(out: mat4): void {
    mat4.copy(out, this.projectionMat);
  }

  normalMat(out: mat4, modelMat: mat4): mat4 {
    mat4.invert(out, modelMat);
    mat4.transpose(out, out);
    return out;
  }

  modelViewAndNormalMat(mvMat: mat4, mvNormalMat: mat4, modelMat: mat4): mat4 {
    mat4.multiply(mvMat, this.invertWorldMat, modelMat);
    mat4.invert(mvNormalMat, mvMat);
    mat4.transpose(mvNormalMat, mvNormalMat);
    return mvNormalMat;
  }

  mv(out: mat4, modelMat: mat4): void {
    mat4.multiply(out, this.invertWorldMat, modelMat);
  }
}
