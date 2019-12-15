import { wasmStruct } from '../wasm/decorators/classes';
import { mat4, quat, vec3 } from 'gl-matrix';
import { WasmPtrVector } from '../wasm/WasmPtrVector';
import { WasmClassRelocatable } from '../wasm/WasmClassRelocatable';
import { wasmFunctionOut } from '../wasm/decorators/methods';

export enum DirtyFlag {
  None = 0x00,
  Local = 0x01,
  Global = 0x02,
  Bounds = 0x04,
  Frustrum = 0x08,
  All = 0xff,
}

const RAD_DEG = 180 / Math.PI;

const tRotMat = mat4.create();
const IDENT_MAT4 = mat4.create();
const tQuat = quat.create();

export function translateScaleRotateQuat(out: mat4, scale: vec3, rotQuat: quat, pos: vec3, rotMat: mat4 = tRotMat) {
  mat4.translate(out, IDENT_MAT4, pos);
  mat4.scale(out, out, scale);
  mat4.fromQuat(rotMat, rotQuat);
  mat4.multiply(out, out, rotMat);
}

export class Transform {
  protected dirty: DirtyFlag;

  protected margin: number;

  protected position: vec3;

  protected scale: vec3;

  protected rotation: quat;

  protected localMat: mat4;

  protected rotMat: mat4;

  protected worldMat: mat4;

  protected _children: Transform[];

  constructor() {
    this.position = vec3.fromValues(0, 0, 0);
    this.scale = vec3.fromValues(1, 1, 1);
    this.rotation = quat.create();
    this.worldMat = mat4.create();
    this.rotMat = mat4.create();
    this.localMat = mat4.create();
    this.dirty = DirtyFlag.None;
    this._children = [];
  }

  get children() {
    return this._children;
  }

  reset() {
    vec3.set(this.position, 0, 0, 0);
    vec3.set(this.scale, 1, 1, 1);
    quat.identity(this.rotation);
    mat4.identity(this.worldMat);
    mat4.identity(this.rotMat);
    mat4.identity(this.localMat);
    this.dirty = DirtyFlag.None;
  }

  addChild(tr: Transform) {
    if (this._children.indexOf(tr) === -1) {
      this.dirty |= DirtyFlag.Bounds;
      this._children.push(tr);
    }
  }

  removeChild(tr: Transform) {
    const ind = this._children.indexOf(tr);
    if (ind !== -1) {
      this._children.splice(ind, 1);
      this.dirty |= DirtyFlag.Bounds;
    }
  }

  getLocalMat(): mat4 {
    if (this.dirty | DirtyFlag.Local) {
      this.updateLocalMat();
    }
    return this.localMat;
  }

  rotateAroundAxes(axe: vec3, rad: number) {
    quat.setAxisAngle(tQuat, axe, rad);
    quat.multiply(this.rotation, this.rotation, tQuat);
    this.dirty |= DirtyFlag.Local;
  }

  rotateEuler(radX: number, radY: number, radZ: number) {
    const rotation = this.rotation;
    quat.rotateX(rotation, rotation, radX);
    quat.rotateY(rotation, rotation, radY);
    quat.rotateZ(rotation, rotation, radZ);
    this.dirty |= DirtyFlag.Local;
  }

  setEulerRotation(radX: number, radY: number, radZ: number) {
    quat.fromEuler(this.rotation, radX * RAD_DEG, radY * RAD_DEG, radZ * RAD_DEG);
    this.dirty |= DirtyFlag.All;
  }

  setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
    this.dirty |= DirtyFlag.All;
  }

  setScale(x: number, y: number, z: number) {
    vec3.set(this.scale, x, y, z);
    this.dirty |= DirtyFlag.All;
  }

  translate(x: number, y: number, z: number) {
    const position = this.position;

    position[0] += x;
    position[1] += y;
    position[2] += z;
    this.dirty |= DirtyFlag.All;
  }

  protected updateLocalMat() {
    translateScaleRotateQuat(this.localMat, this.scale, this.rotation, this.position, this.rotMat);
    this.dirty &= ~DirtyFlag.Local;
  }

  updateWorldMat(parentMat?: mat4, parentWasDirty: boolean = false) {
    const dirtyLocalOrGlobal = DirtyFlag.Local | DirtyFlag.Global;
    const worldMat = this.worldMat;

    if ((dirtyLocalOrGlobal & this.dirty) !== 0 || parentWasDirty === true) {
      if (this.dirty | DirtyFlag.Local) {
        translateScaleRotateQuat(this.localMat, this.scale, this.rotation, this.position, this.rotMat);
      }
      if (parentMat !== undefined) {
        mat4.multiply(worldMat, parentMat, this.localMat);
      } else {
        mat4.copy(this.worldMat, this.localMat);
      }

      this.dirty &= ~dirtyLocalOrGlobal;
      parentWasDirty = true;
    }

    for (const child of this._children) {
      child.updateWorldMat(worldMat, parentWasDirty);
    }
  }

  destroy(freePtr?: boolean) {}

  log() {
    console.log(this);
    console.log('dirty ', this.dirty);
    console.log('position ', this.position);
    console.log('scale ', this.scale);
    console.log('rotation ', this.rotation);
    console.log('localMat ', this.localMat);
    console.log('worldMat ', this.worldMat);
    console.log('rotMat ', this.rotMat);
    console.log('Children ', this._children);
  }
}
