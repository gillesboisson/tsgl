import { mat2d, mat4, quat, vec2 } from 'gl-matrix';
import { ITransform } from '../gl/abstract/ITransform';
import { IDispose } from '../core/IDispose';
import { IReset } from '../core/IReset';

const __ident: mat2d = mat2d.create();

export class Transform2D implements ITransform<mat2d>, IDispose, IReset {
  protected _rotation: number = 0;
  protected _cx: number = 0;
  protected _cy: number = 0;
  protected _sx: number = 0;
  protected _sy: number = 0;

  public position: vec2 = vec2.create();
  public scale: vec2 = vec2.create();
  public pivot: vec2 = vec2.create();
  public size: vec2 = vec2.create();
  protected _localMat: mat2d = mat2d.create();
  protected _dirty = false;
  protected _dirtyRotation = false;

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    if (value !== this._rotation) {
      this._rotation = value;
      this._dirtyRotation = true;
    }
  }

  constructor() {
    this.reset();
  }

  getLocalMat(): mat2d {
    if (this._dirty === true) this.updateLocalMat();
    return this._localMat;
  }

  setDirty(): void {
    this._dirty = true;
  }

  reset() {
    this._rotation = 0;
    this.pivot[0] = 0;
    this.pivot[1] = 0;
    this.size[0] = 0;
    this.size[1] = 0;
    this.position[0] = 0;
    this.position[1] = 0;
    this.scale[0] = 1;
    this.scale[1] = 1;
    this._cx = 1;
    this._cy = 0;
    this._sx = 0;
    this._sy = 1;
    this._dirty = false;
    this._dirtyRotation = false;
    mat2d.identity(this._localMat);
  }

  protected updateLocalMat() {
    if (this._dirtyRotation === true) this.updateRot();

    const mt = this._localMat;

    // apply rotation
    mt[0] = this._cx * this.scale[0];
    mt[1] = this._sx * this.scale[0];
    mt[2] = this._cy * this.scale[1];
    mt[3] = this._sy * this.scale[1];

    // update size when anchors has a size and there is an area

    // var realArea = this.getDefaultArea(vec2_4);
    // var containerArea = this.getContainerArea(vec2_4);

    /*
        if (this.area !== null) {

          realArea = this.area;




        } else {

          realArea = containerArea;

        }
        */

    // if (this.anchor[2] !== 0)
    //     this.size[0] = this.requestedSize[0] = this.anchor[2] * realArea[0];
    // else
    //     this.requestedSize[0] = realArea[0];
    //
    // if (this.anchor[3] !== 0)
    //     this.size[1] = this.requestedSize[1] = this.anchor[3] * realArea[1];
    // else
    //     this.requestedSize[1] = realArea[1];

    //debugger;

    // this.updateLayout(this);

    const px = this.size[0] !== 0 ? this.pivot[0] * this.size[0] : this.pivot[0];
    const py = this.size[1] !== 0 ? this.pivot[1] * this.size[1] : this.pivot[1];

    // if (containerArea !== null &&
    //     (
    //         this.anchor[0] !== 0 ||
    //         this.anchor[1] !== 0 ||
    //         this.anchor[2] !== 0 ||
    //         this.anchor[3] !== 0
    //     )
    // ) {
    //     const aX = this.anchor[0] * containerArea[0];
    //     const aY = this.anchor[1] * containerArea[1];
    //
    //
    //     mt[4] = (this.position[0] + px) * this.scale[0] + aX - ((px * mt[0]) + (py * mt[2]));
    //     mt[5] = (this.position[1] + py) * this.scale[1] + aY - ((px * mt[1]) + (py * mt[3]));
    //
    // } else {
    mt[4] = this.position[0] - (px * mt[0] + py * mt[2]);
    mt[5] = this.position[1] - (px * mt[1] + py * mt[3]);
    //debugger;
    // }
  }

  dispose() {
    this.scale = null;
    this.position = null;
    this.pivot = null;
    this.size = null;
    this._localMat = null;
  }

  updateRot() {
    this._dirtyRotation = false;
    this._cx = Math.cos(this._rotation);
    this._sx = Math.sin(this._rotation);
    this._cy = -this._sx; // cos, added PI/2
    this._sy = this._cx; // sin, added PI/2
  }

  updateWorldMat(worldMat: mat2d, parentMat = __ident) {
    this.updateLocalMat();

    const lc = this._localMat;
    const pm = parentMat;

    worldMat[0] = lc[0] * pm[0] + lc[1] * pm[2];
    worldMat[1] = lc[0] * pm[1] + lc[1] * pm[3];
    worldMat[2] = lc[2] * pm[0] + lc[3] * pm[2];
    worldMat[3] = lc[2] * pm[1] + lc[3] * pm[3];
    worldMat[4] = lc[4] * pm[0] + lc[5] * pm[2] + pm[4];
    worldMat[5] = lc[4] * pm[1] + lc[5] * pm[3] + pm[5];
  }
}
