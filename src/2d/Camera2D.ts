import { Camera } from '../3d/Camera';
import { mat4 } from 'gl-matrix';
import { Transform3D } from '../geom/Transform3D';

export class Camera2D extends Camera {
  protected _viewportWidth: number;
  protected _viewportHeight: number;

  get viewportWidth(): number {
    return this._viewportWidth;
  }

  get viewportHeight(): number {
    return this._viewportHeight;
  }

  get x(): number {
    return this.transform.getRawPosition()[0];
  }

  get y(): number {
    return this.transform.getRawPosition()[1];
  }

  constructor(viewportWidth: number, viewportHeight: number) {
    super();
    this.setViewport(viewportWidth, viewportHeight);
    this.setPosition(0, 0);
  }

  setClampedPosition(x: number, y: number, minX: number, maxX: number, minY: number, maxY: number) {
    if (x < minX) x = minX;
    else if (x + this.viewportWidth > maxX) x = maxX - this.viewportWidth;

    if (y < minY) y = minY;
    else if (y + this.viewportHeight > maxY) y = maxY - this.viewportHeight;

    this.setPosition(x, y);
  }

  setPosition(x: number, y: number) {
    this.transform.setPosition(x, y, 1.0);
    this.updateWorldMat();
  }

  setViewport(viewportWidth: number, viewportHeight: number) {
    this.setDimension2d(viewportWidth, viewportHeight);
    this._viewportWidth = viewportWidth;
    this._viewportHeight = viewportHeight;
    this.updateWorldMat();
  }
}
