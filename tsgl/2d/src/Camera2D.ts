import { mat4 } from 'gl-matrix';
import { Camera } from '@tsgl/common';

export class Camera2D extends Camera {
  protected _near: number;
  protected _far: number;
  protected _width: number;
  protected _height: number;
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

  get viewportWidth(): number {
    return this._width;
  }

  set viewportWidth(val: number) {
    if (val !== this._width) {
      this._width = val;
      this._dirtyProjection = true;
    }
  }

  get viewportHeight(): number {
    return this._height;
  }

  set viewportHeight(val: number) {
    if (val !== this._height) {
      this._height = val;
      this._dirtyProjection = true;
    }
  }

  constructor(width: number, height: number, near = 0.0001, far = 100) {
    super();

    this._width = width;
    this._height = height;
    this._near = near;
    this._far = far;
    this._dirtyProjection = true;
  }

  setClampedPosition(x: number, y: number, minX: number, maxX: number, minY: number, maxY: number, z = 1.0): void {
    if (x < minX) x = minX;
    else if (x + this._width > maxX) x = maxX - this._width;

    if (y < minY) y = minY;
    else if (y + this._height > maxY) y = maxY - this._height;

    this.transform.setPosition(x, y, z);
  }

  setViewport(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this._dirtyProjection = true;
  }

  updateTransform(parentMat?: mat4): void {
    if (this._dirtyProjection === true) {
      this.setDimension2d(this._width, this._height, this._near, this._far);
      this._dirtyProjection = false;
    }

    return super.updateTransform(parentMat);
  }
}
