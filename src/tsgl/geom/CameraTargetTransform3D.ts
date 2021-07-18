import { mat4, vec3 } from 'gl-matrix';
import { ITransform } from '../gl/abstract/ITransform';

export const IDENT_MAT4 = mat4.create();
export const tv = vec3.create();
export const __lookAtBaseVec = vec3.fromValues(0, 0, -1);
export const _vUp = vec3.fromValues(0,1,0);
// export const _vForwoard = vec3.fromValues(0,0,1);

export const _vCamRight = vec3.create();
export const _vCamUp = vec3.create();


export abstract class ACameraBaseTargetTransform3D implements ITransform<mat4>{
  protected _position: vec3;
  
  protected _localMat: mat4;
  protected _rotMat: mat4;
  protected _dirty: boolean;

  setDirty(): void {
    this._dirty = true;
  }

  getLocalMat(): mat4 {
    if (this._dirty === true)
      this.updateLocalMat();
    return this._localMat;
  }

  

  constructor() {
    this._position = vec3.create();
   
    this._localMat = mat4.create();
    this._rotMat = mat4.create();
  }

  public getRawPosition(): vec3 {
    return this._position;
  }
  public setPosition(x: number, y: number, z: number): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }
  

  public translate(x: number, y: number, z: number): void {
    this._position[0] += x;
    this._position[1] += y;
    this._position[2] +=   z;
    this._dirty = true;
  }

  protected abstract updateLocalMat(): void;
  
}

export class CameraTargetTransform3D extends ACameraBaseTargetTransform3D  {
  protected _targetPosition: vec3;
  constructor() {
    super();
    this._targetPosition = vec3.create();
  }

  public getRawTargetPosition(): vec3 {
    return this._targetPosition;
  }
  public setTargetPosition(x: number, y: number, z: number): void {
    vec3.set(this._targetPosition, x, y, z);
    this._dirty = true;
  }

  public copyTargetPosition(targetPosition: vec3): void {
    vec3.copy(this._targetPosition, targetPosition);
    this._dirty = true;
  }
  
  protected updateLocalMat(): void {
    // const out = this._localMat;
    mat4.targetTo(this._localMat,this._position,this._targetPosition,_vUp);

    // multiply final
    // mat4.multiply(out, out, this._rotMat);
    this._dirty = false;
  }
}
export class CameraLookAtTransform3D extends ACameraBaseTargetTransform3D  {
  protected _lookAt: vec3;
  constructor() {
    super();
    this._lookAt = vec3.fromValues(1,0,-1);
  }

  public getRawLookAt(): vec3 {
    return this._lookAt;
  }
  public setLookAt(x: number, y: number, z: number): void {
    vec3.normalize(this._lookAt, vec3.set(this._lookAt, x, y, z));
    this._dirty = true;
  }

  public copyLookAt(targetPosition: vec3): void {
    vec3.normalize(this._lookAt,vec3.copy(this._lookAt, targetPosition));
    this._dirty = true;
  }

  protected updateLocalMat(): void {
    // const out = this._localMat;

    vec3.add(tv,this._position, this._lookAt);
    mat4.targetTo(this._localMat,this._position,tv,_vUp);


    // multiply final
    // mat4.multiply(out, out, this._rotMat);
    this._dirty = false;
  }
}
