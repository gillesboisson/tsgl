import { mat4 } from 'gl-matrix';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {
  protected _near: number;
  protected _far: number;
  protected _fov: number;
  protected _aspect: number;
  private _dirtyProjection: boolean;

  get near(): number {
    return this._near;
  }

  set near(val: number) {
    if (val !== this._near) {
      this._near = val;
      this._dirtyProjection = true;
    }
  }

  get far(): number {
    return this._far;
  }

  set far(val: number) {
    if (val !== this._far) {
      this._far = val;
      this._dirtyProjection = true;
    }
  }

  get fov(): number {
    return this._fov;
  }

  set fov(val: number) {
    if (val !== this._fov) {
      this._fov = val;
      this._dirtyProjection = true;
    }
  }
  get aspect(): number {
    return this._aspect;
  }

  set aspect(val: number) {
    if (val !== this._aspect) {
      this._aspect = val;
      this._dirtyProjection = true;
    }
  }

  constructor(fov: number, aspect: number, near = 0.0001, far = 100) {
    super();

    this._fov = fov;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    this._dirtyProjection = true;
  }

  updateTransform(parentMat?: mat4): void {
    if (this._dirtyProjection === true) {
      this.setPerspective(this._fov, this._aspect, this._near, this._far);
      this._dirtyProjection = false;
    }

    return super.updateTransform(parentMat);
  }
}
