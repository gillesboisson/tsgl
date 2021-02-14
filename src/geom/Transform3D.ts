import { mat4, quat, vec3 } from 'gl-matrix';
import { ITransform } from '../gl/abstract/ITransform';
import { TranslateRotateTransform3D } from './TranslateRotateTransform3D';

export const IDENT_MAT4 = mat4.create();
export const __quat1: quat = quat.create();

export const __vec31: vec3 = vec3.create();
// const __vec32: vec3 = vec3.create();
// const __vec33: vec3 = vec3.create();
export const __lookAtBaseVec = vec3.fromValues(0, 0, 1);


export class Transform3D extends TranslateRotateTransform3D implements ITransform<mat4>  {
  static translateScaleRotateQuat(out: mat4, scale: vec3, rotQuat: quat, position: vec3, rotMat: mat4): mat4 {
    mat4.translate(out, IDENT_MAT4, position);
    mat4.scale(out, out, scale);
    mat4.fromQuat(rotMat, rotQuat);
    mat4.multiply(out, out, rotMat);
    return out;
  }

  protected _rotation: quat;
  protected _position: vec3;
  protected _scale: vec3;
  protected _localMat: mat4;
  protected _rotMat: mat4;
  protected _dirty = true;

  constructor() {
    super();
    this._scale = vec3.fromValues(1, 1, 1);
  }

  public getRawScale(): vec3 {
    return this._scale;
  }

  public setScale(x: number, y?: number, z?: number): void {
    vec3.set(this._scale, x, y !== undefined ? y : x, z !== undefined ? z : x);
    this._dirty = true;
  }

  protected updateLocalMat(): void {
    const out = this._localMat;
    mat4.translate(out, IDENT_MAT4, this._position);
    mat4.scale(out, out,this._scale);
    mat4.fromQuat(this._rotMat, this._rotation);
    mat4.multiply(out, out, this._rotMat);
    this._dirty = false;
  }

}


