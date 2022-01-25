import { vec3, vec4, mat4 } from 'gl-matrix';
import { box, CollisionType, createVertices, plane, Vertices } from '.';


const _vmax = vec3.create();
const _vmin = vec3.create();

const _boxVertices = createVertices(
  [-1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1, 1, -1, 1],
  4,
);

const _boundsVertices3 = createVertices(8, 3);

const _v4 = vec4.create();

export default class Frustrum {
  planes: Vertices<Float32Array>;
  private _dirtyBounds: boolean;
  private _invertMat: mat4;
  private _bounds: box;

  constructor() {
    this.planes = createVertices(6, 4);

    this._dirtyBounds = true;

    this._invertMat = mat4.create();
    this._bounds = box.create();
  }

  setFromMat(me: mat4): Frustrum {
    const planes = this.planes;
    const me0 = me[0],
      me1 = me[1],
      me2 = me[2],
      me3 = me[3];
    const me4 = me[4],
      me5 = me[5],
      me6 = me[6],
      me7 = me[7];
    const me8 = me[8],
      me9 = me[9],
      me10 = me[10],
      me11 = me[11];
    const me12 = me[12],
      me13 = me[13],
      me14 = me[14],
      me15 = me[15];

    plane.normalize(plane.set(planes[0], me3 - me0, me7 - me4, me11 - me8, me15 - me12));
    plane.normalize(plane.set(planes[1], me3 + me0, me7 + me4, me11 + me8, me15 + me12));
    plane.normalize(plane.set(planes[2], me3 + me1, me7 + me5, me11 + me9, me15 + me13));
    plane.normalize(plane.set(planes[3], me3 - me1, me7 - me5, me11 - me9, me15 - me13));
    plane.normalize(plane.set(planes[4], me3 - me2, me7 - me6, me11 - me10, me15 - me14));
    plane.normalize(plane.set(planes[5], me3 + me2, me7 + me6, me11 + me10, me15 + me14));

    this._dirtyBounds = true;

    mat4.invert(this._invertMat, me);

    return this;
  }

  intersectBounds(rect: box): CollisionType {
    let res = CollisionType.INSIDE;

    let i: number;
    let plane: plane;

    for (i = 0; i < 6; i++) {
      plane = this.planes[i];

      if (plane[0] > 0) {
        _vmin[0] = rect[0];
        _vmax[0] = rect[1];
      } else {
        _vmin[0] = rect[1];
        _vmax[0] = rect[0];
      }
      // Y axis
      if (plane[1] > 0) {
        _vmin[1] = rect[2];
        _vmax[1] = rect[3];
      } else {
        _vmin[1] = rect[3];
        _vmax[1] = rect[2];
      }

      if (plane[2] > 0) {
        _vmin[2] = rect[4];
        _vmax[2] = rect[5];
      } else {
        _vmin[2] = rect[5];
        _vmax[2] = rect[4];
      }

      if (vec3.dot(plane as any, _vmax) + plane[3] >= 0) {
        if (vec3.dot(plane as any, _vmin) + plane[3] < 0) res = CollisionType.INTERSECT;
      } else return CollisionType.OUTSIDE;
    }
    return res;
  }

  containsVec(vec: vec3): boolean {
    const planes = this.planes;

    let i;

    for (i = 0; i < 6; i++) {
      if (plane.distanceToVec(planes[i], vec) < 0) {
        return false;
      }
    }

    return true;
  }

  get bounds(): box {
    if (this._dirtyBounds) {
      this._dirtyBounds = false;
      const invMat = this._invertMat;

      for (let i = 0; i < _boundsVertices3.length; i++) {
        //v = _boundsVertices4[i];
        vec4.transformMat4(_v4, _boxVertices[i] as vec4, invMat);
        vec3.set(_boundsVertices3[i] as vec3, _v4[0] / _v4[3], _v4[1] / _v4[3], _v4[2] / _v4[3]);
      }

      box.setFromVertices(this._bounds, _boundsVertices3.buffer);
    }

    return this._bounds;
  }
}
