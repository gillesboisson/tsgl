import { mat4 } from 'gl-matrix';
import { Camera } from '../utils';

export class OrthographicCamera extends Camera {
  protected _near: number;
  protected _far: number;
  protected _left: number;
  protected _right: number;
  protected _bottom: number;
  protected _top: number;
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

  get left(): number {
    return this._left;
  }

  set left(val: number) {
    if (val !== this._left) {
      this._left = val;
      this._dirtyProjection = true;
    }
  }

  get right(): number {
    return this._right;
  }

  set right(val: number) {
    if (val !== this._right) {
      this._right = val;
      this._dirtyProjection = true;
    }
  }
  get bottom(): number {
    return this._bottom;
  }

  set bottom(val: number) {
    if (val !== this._bottom) {
      this._bottom = val;
      this._dirtyProjection = true;
    }
  }
  get top(): number {
    return this._top;
  }

  set top(val: number) {
    if (val !== this._top) {
      this._top = val;
      this._dirtyProjection = true;
    }
  }

  constructor(left: number, right: number, bottom: number, top: number, near = 0.0001, far = 100) {
    super();

    this._left = left;
    this._right = right;
    this._bottom = bottom;
    this._top = top;
    this._near = near;
    this._far = far;
    this._dirtyProjection = true;
  }

  updateTransform(parentMat?: mat4): void {
    if (this._dirtyProjection === true) {
      this.setOrtho(this._left, this._right, this._bottom, this._top, this._near, this._far);
      this._dirtyProjection = false;
    }

    return super.updateTransform(parentMat);
  }
}
