import { WasmClass } from '../wasm/WasmClass';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { structAttr, structBool } from '../core/decorators/StructAttribute';
import { box, setFromVertices as box_setFromVertices } from './box';
import { normalize as plane_normalize, set as plane_set, distanceToVec as plane_distanceToVec } from './plane';
import { plane } from './plane';
import { CollisionType } from './CollisionType';
import { createVertices } from './createVertices';
import { WasmAllocatorI } from '../wasm/allocators/interfaces';
import { wasmStruct } from '../wasm/decorators/classes';

const vec4_create = vec4.create;
const vec4_transformMat4 = vec4.transformMat4;

const vec3_create = vec3.create;
const vec3_dot = vec3.dot;
const vec3_set = vec3.set;

let __v1 = vec3_create();
let __v2 = vec3_create();

let _vmax = vec3_create();
let _vmin = vec3_create();

const _boundsVertices3 = createVertices(8, 3);

let _v4 = vec4_create();

const _boxVertices = createVertices(
  [-1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1, 1, -1, 1],
  4,
);

@wasmStruct({ methodsPrefix: 'Frustum_' })
export class Frustrum extends WasmClass {
  // Wasm Attribute Binding ==========================================
  static byteLength: number;
  static allocator: WasmAllocatorI<Frustrum>;

  @structBool()
  protected _dirtyBounds: boolean;

  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane1: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane2: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane3: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane4: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane5: Float32Array;
  @structAttr({
    type: Float32Array,
    length: 4,
  })
  private __plane6: Float32Array;

  @structAttr({
    type: Float32Array,
    length: 16,
  })
  protected _invertMat: mat4;

  @structAttr({
    type: Float32Array,
    length: 6,
  })
  protected _bounds: box;

  planes: plane[];

  init(firstInit?: boolean) {
    this.planes = [this.__plane1, this.__plane2, this.__plane3, this.__plane4, this.__plane5, this.__plane6];
    this._dirtyBounds = true;
  }

  destroy(freePtr?: boolean) {
    this.planes.splice(0);
    delete this.planes;

    super.destroy(freePtr);
  }

  setFromMat(me: mat4) {
    var planes = this.planes;
    var me0 = me[0],
      me1 = me[1],
      me2 = me[2],
      me3 = me[3];
    var me4 = me[4],
      me5 = me[5],
      me6 = me[6],
      me7 = me[7];
    var me8 = me[8],
      me9 = me[9],
      me10 = me[10],
      me11 = me[11];
    var me12 = me[12],
      me13 = me[13],
      me14 = me[14],
      me15 = me[15];

    plane_normalize(plane_set(planes[0], me3 - me0, me7 - me4, me11 - me8, me15 - me12));
    plane_normalize(plane_set(planes[1], me3 + me0, me7 + me4, me11 + me8, me15 + me12));
    plane_normalize(plane_set(planes[2], me3 + me1, me7 + me5, me11 + me9, me15 + me13));
    plane_normalize(plane_set(planes[3], me3 - me1, me7 - me5, me11 - me9, me15 - me13));
    plane_normalize(plane_set(planes[4], me3 - me2, me7 - me6, me11 - me10, me15 - me14));
    plane_normalize(plane_set(planes[5], me3 + me2, me7 + me6, me11 + me10, me15 + me14));

    this._dirtyBounds = true;

    mat4.invert(this._invertMat, me);

    return this;
  }

  intersectBounds(rect: box) {
    let res = CollisionType.Inside;

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

      if (vec3_dot(plane as vec3, _vmax) + plane[3] >= 0) {
        if (vec3_dot(plane as vec3, _vmin) + plane[3] < 0) res = CollisionType.Intersect;
      } else return CollisionType.Outside;
    }
    return res;
  }

  containsVec(vec: vec3): boolean {
    const planes = this.planes;

    let i;

    for (i = 0; i < 6; i++) {
      if (plane_distanceToVec(planes[i], vec) < 0) {
        return false;
      }
    }

    return true;
  }

  get bounds(): box {
    if (this._dirtyBounds) {
      let v;

      this._dirtyBounds = false;
      const invMat = this._invertMat;

      for (let i = 0; i < _boundsVertices3.length; i++) {
        //v = _boundsVertices4[i];
        vec4_transformMat4(_v4, _boxVertices[i], invMat);
        vec3_set(_boundsVertices3[i], _v4[0] / _v4[3], _v4[1] / _v4[3], _v4[2] / _v4[3]);
      }

      box_setFromVertices(this._bounds, _boundsVertices3.buffer as Float32Array);
    }

    return this._bounds;
  }
}
