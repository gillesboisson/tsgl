import { mat4, quat, vec3 } from 'gl-matrix';
import { ITransform } from '../gl/abstract/ITransform';
import { IDENT_MAT4, __quat1, __lookAtBaseVec, __vec31 } from './Transform3D';

export const unitVectorX = vec3.fromValues(1, 0, 0);
export const unitVectorY = vec3.fromValues(0, 1, 0);
export const unitVectorZ = vec3.fromValues(0, 0, 1);

export const unitVectorNegX = vec3.fromValues(-1, 0, 0);
export const unitVectorNegY = vec3.fromValues(0, -1, 0);
export const unitVectorNegZ = vec3.fromValues(0, 0, -1);

export class TranslateRotateTransform3D implements ITransform<mat4> {
  protected _rotation: quat;
  protected _position: vec3;
  protected _localMat: mat4;
  protected _rotMat: mat4;
  protected _dirty = true;

  get dirty(): boolean{
    return this._dirty;
  }

  constructor() {
    this._rotation = quat.create();
    this._position = vec3.create();
    this._localMat = mat4.create();
    this._rotMat = mat4.create();
  }

  getLocalMat(): mat4 {
    if (this._dirty === true) this.updateLocalMat();
    return this._localMat;
  }

  direction(directionOut: vec3, refVec = unitVectorX): void {
    vec3.transformQuat(directionOut, refVec, this._rotation);
  }

  protected updateLocalMat(): void {
    const out = this._localMat;
    mat4.translate(out, IDENT_MAT4, this._position);
    mat4.fromQuat(this._rotMat, this._rotation);
    mat4.multiply(out, out, this._rotMat);
    this._dirty = false;
  }

  public getRawPosition(): vec3 {
    return this._position;
  }

  public getRawRotation(): quat {
    return this._rotation;
  }

  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }

  public translate(x: number, y: number, z: number): void {
    this._position[0] += x;
    this._position[1] += y;
    this._position[2] += z;
    this._dirty = true;
  }

  public setRotationEuler(x: number, y: number, z: number): void {
    quat.identity(this._rotation);
    quat.rotateX(this._rotation, this._rotation, x);
    quat.rotateY(this._rotation, this._rotation, y);
    quat.rotateZ(this._rotation, this._rotation, z);
    this._dirty = true;
  }

  public setRotationQuat(x: number, y: number, z: number, w: number): void {
    quat.set(this._rotation, x, y, z, w);
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

  public rotationTo(targetPosition: vec3, refVec: vec3 = __lookAtBaseVec): void {
    vec3.subtract(__vec31, targetPosition, vec3.normalize(__vec31, this._position));
    quat.rotationTo(this._rotation, __vec31, refVec);
    this._dirty = true;
  }

  public setDirty(): void {
    this._dirty = true;
  }
}
