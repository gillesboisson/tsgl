import { mat4, quat, vec3 } from 'gl-matrix';
import { ITransform } from '../gl/abstract/ITransform';

const IDENT_MAT4 = mat4.create();
const __quat1: quat = quat.create();

export class Transform3D implements ITransform<mat4> {
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
    this._rotation = quat.create();
    this._position = vec3.create();
    this._scale = vec3.fromValues(1, 1, 1);
    this._localMat = mat4.create();
    this._rotMat = mat4.create();
  }

  getLocalMat(): mat4 {
    if (this._dirty === true) this.updateLocalMat();
    return this._localMat;
  }

  protected updateLocalMat(): void {
    Transform3D.translateScaleRotateQuat(this._localMat, this._scale, this._rotation, this._position, this._rotMat);
    this._dirty = false;
  }

  public getRawPosition(): vec3 {
    return this._position;
  }
  public getRawScale(): vec3 {
    return this._scale;
  }
  public getRawRotation(): quat {
    return this._rotation;
  }

  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }
  public setScale(x: number, y?: number, z?: number): void {
    vec3.set(this._scale, x, y !== undefined ? y : x, z !== undefined ? z : x);
    this._dirty = true;
  }

  public translate(x: number, y: number, z: number): void {
    this._position[0] += x;
    this._position[1] += y;
    this._position[2] += z;
    this._dirty = true;
  }

  public setRotationEuler(x: number, y: number, z: number): void {
    quat.fromEuler(this._rotation, x, y, z);
    this._dirty = true;
  }

  public rotateEuler(x: number, y: number, z: number): void {
    quat.rotateX(this._rotation, this._rotation, x);
    quat.rotateY(this._rotation, this._rotation, y);
    quat.rotateZ(this._rotation, this._rotation, z);
    this._dirty = true;
  }

  public rotateAroundAxes(axe: vec3, angle: number): void {
    quat.setAxisAngle(__quat1, axe, angle);
    quat.mul(this._rotation, this._rotation, __quat1);
    this._dirty = true;
  }

  public setRotation(x: number, y: number, z: number): void {
    quat.fromEuler(this._rotation, x, y, z);
    this._dirty = true;
  }

  public setDirty(): void {
    this._dirty = true;
  }
}
