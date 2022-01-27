import { mat2d, vec2 } from 'gl-matrix';
import { IReset, IDestroy } from '../../common';
import { ITransform } from './ITransform';


const __ident: mat2d = mat2d.create();

export class Transform2D implements ITransform<mat2d>, IDestroy, IReset {
  protected _rotation = 0;
  protected _cx = 0;
  protected _cy = 0;
  protected _sx = 0;
  protected _sy = 0;

  public position: vec2 = vec2.create();
  public scale: vec2 = vec2.create();
  public pivot: vec2 = vec2.create();
  public size: vec2 = vec2.create();
  protected _localMat: mat2d = mat2d.create();
  protected _dirty = false;
  protected _dirtyRotation = false;

  get rotation(): number {
    return this._rotation;
  }

  set rotation(value: number) {
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

  reset(): void {
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

  protected updateLocalMat(): void {
    if (this._dirtyRotation === true) this.updateRot();

    const mt = this._localMat;

    // apply rotation
    mt[0] = this._cx * this.scale[0];
    mt[1] = this._sx * this.scale[0];
    mt[2] = this._cy * this.scale[1];
    mt[3] = this._sy * this.scale[1];

    const px = this.size[0] !== 0 ? this.pivot[0] * this.size[0] : this.pivot[0];
    const py = this.size[1] !== 0 ? this.pivot[1] * this.size[1] : this.pivot[1];

    mt[4] = this.position[0] - (px * mt[0] + py * mt[2]);
    mt[5] = this.position[1] - (px * mt[1] + py * mt[3]);
  }

  destroy(): void {
    this.scale = null;
    this.position = null;
    this.pivot = null;
    this.size = null;
    this._localMat = null;
  }

  updateRot(): void {
    this._dirtyRotation = false;
    this._cx = Math.cos(this._rotation);
    this._sx = Math.sin(this._rotation);
    this._cy = -this._sx; // cos, added PI/2
    this._sy = this._cx; // sin, added PI/2
  }

  updateWorldMat(worldMat: mat2d, parentMat = __ident): void {
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
