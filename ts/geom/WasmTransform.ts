import { wasmStruct } from '../wasm/decorators/classes';
import { mat4, quat, vec3 } from 'gl-matrix';
import { WasmPtrVector } from '../wasm/WasmPtrVector';
import { WasmClassRelocatable } from '../wasm/WasmClassRelocatable';
import { wasmFunctionOut } from '../wasm/decorators/methods';
import { structAttr, wasmObjectAttr } from '../core/decorators/StructAttribute';
import { translateScaleRotateQuat, DirtyFlag } from './Transform';

// export enum TransformType {
//   Normal = 0,
//   Static = 1,
//   Cam = 2,
// }

const RAD_DEG = 180 / Math.PI;

const tRotMat = mat4.create();
const IDENT_MAT4 = mat4.create();
const tQuat = quat.create();

@wasmStruct({ methodsPrefix: 'Transform_' })
export class WasmTransform extends WasmClassRelocatable {
  // Wasm Attribute Binding ==========================================

  @structAttr({
    length: 1,
    type: Int16Array,
  })
  protected dirty: DirtyFlag;

  @structAttr({
    length: 1,
    type: Int16Array,
  })
  private __margin: number;

  @structAttr({
    length: 3,
    type: Float32Array,
  })
  protected _position: vec3;

  @structAttr({
    length: 3,
    type: Float32Array,
  })
  protected _scale: vec3;

  @structAttr({
    length: 4,
    type: Float32Array,
  })
  protected _rotation: quat;

  @structAttr({
    length: 16,
    type: Float32Array,
  })
  protected localMat: mat4;

  @structAttr({
    length: 16,
    type: Float32Array,
  })
  protected rotMat: mat4;

  // Wasm Function Binding ==========================================

  // @wasmFunctionOut('updateWorldMat', ['number', 'number'])
  // public wasmUpdateWorldMat: (matPtr: number, parentWasdirty: boolean) => void;

  @wasmFunctionOut()
  print: (debugChildren: boolean) => void;

  // ==================================================================

  get rotation(): quat {
    return this._rotation;
  }
  get position(): vec3 {
    return this._position;
  }

  get scale(): vec3 {
    return this._scale;
  }

  init(firstInit?: boolean) {
    super.init(firstInit);
    if (firstInit === true) {
      vec3.set(this._position, 0, 0, 0);
      vec3.set(this._scale, 1, 1, 1);
      quat.identity(this._rotation);
      // mat4.identity(this.worldMat);
      mat4.identity(this.rotMat);
      mat4.identity(this.localMat);
      this.dirty = DirtyFlag.None;
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
    quat.multiply(this._rotation, this._rotation, tQuat);
    this.dirty |= DirtyFlag.Local;
  }

  rotateEuler(radX: number, radY: number, radZ: number) {
    const rotation = this._rotation;
    quat.rotateX(rotation, rotation, radX);
    quat.rotateY(rotation, rotation, radY);
    quat.rotateZ(rotation, rotation, radZ);
    this.dirty |= DirtyFlag.Local;
  }

  setEulerRotation(radX: number, radY: number, radZ: number) {
    quat.fromEuler(this._rotation, radX * RAD_DEG, radY * RAD_DEG, radZ * RAD_DEG);
    this.dirty |= DirtyFlag.All;
  }

  setPosition(x: number, y: number, z: number) {
    vec3.set(this._position, x, y, z);
    this.dirty |= DirtyFlag.All;
  }

  setScale(x: number, y: number, z: number) {
    vec3.set(this._scale, x, y, z);
    this.dirty |= DirtyFlag.All;
  }

  setDirty(flag: DirtyFlag) {
    this.dirty |= flag;
  }

  unsetDirty(flag: DirtyFlag) {
    this.dirty &= ~flag;
  }

  isDirtyAndUnset(flag: DirtyFlag) {
    const isDirty = (this.dirty & flag) !== 0;
    this.dirty &= ~flag;
    return isDirty;
  }

  translate(x: number, y: number, z: number) {
    const position = this._position;

    position[0] += x;
    position[1] += y;
    position[2] += z;
    this.dirty |= DirtyFlag.All;
  }
  translateVec(vec: vec3) {
    const position = this._position;

    position[0] += vec[0];
    position[1] += vec[1];
    position[2] += vec[2];
    this.dirty |= DirtyFlag.All;
  }

  protected updateLocalMat() {
    translateScaleRotateQuat(this.localMat, this._scale, this._rotation, this._position, this.rotMat);
    this.dirty &= ~DirtyFlag.Local;
  }

  /*
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
  */
  /*
  destroy(freePtr?: boolean) {
    this.childrenPtrVector.destroy(false);
    super.destroy(freePtr);
  }

  destroyWithChildren(freePtr?: boolean) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].destroyWithChildren(freePtr);
    }
    this.childrenPtrVector.destroy(false);
    super.destroy(freePtr);
  }
  */

  log() {
    console.log(this);
    console.log('dirty ', this.dirty);
    console.log('position ', this._position);
    console.log('scale ', this._scale);
    console.log('rotation ', this._rotation);
    console.log('localMat ', this.localMat);
    // console.log('worldMat ', this.worldMat);
    console.log('rotMat ', this.rotMat);
    // console.log('Children ', this._children);
    // this.childrenPtrVector.log();
  }
}
