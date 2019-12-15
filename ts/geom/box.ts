import { vec3, mat4 } from 'gl-matrix';
import { plane } from './plane';

const __v1 = vec3.create();
let __f = 0;

const __points = new Float32Array(24);
const __pointsArray = new Array(8);

for (let i = 0; i < __pointsArray.length; i++) {
  __pointsArray[i] = new Float32Array(__points.buffer, i * 12, 3);
}

export function create(): box {
  return new Float32Array(6) as box;
}

export function set(out: box, minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): box {
  out[0] = minX;
  out[1] = maxX;
  out[2] = minY;
  out[3] = maxY;
  out[4] = minZ;
  out[5] = maxZ;

  return out;
}

export function fromValues(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): box {
  return new Float32Array([minX, maxX, minY, maxY, minZ, maxZ]) as box;
}

export function toVertices(out: box, source: box): box {
  out[0] = source[0];
  out[1] = source[2];
  out[2] = source[4];

  out[3] = source[1];
  out[4] = source[2];
  out[5] = source[4];

  out[6] = source[1];
  out[7] = source[3];
  out[8] = source[4];

  out[9] = source[0];
  out[10] = source[3];
  out[11] = source[4];

  out[12] = source[0];
  out[13] = source[2];
  out[14] = source[5];

  out[15] = source[1];
  out[16] = source[2];
  out[17] = source[5];

  out[18] = source[1];
  out[19] = source[3];
  out[20] = source[5];

  out[21] = source[0];
  out[22] = source[3];
  out[23] = source[5];

  return out;
}

export function updateScalePos(outPos: vec3, outScale: vec3, source: box) {
  outScale[0] = source[1] - source[0];
  outScale[1] = source[2] - source[3];
  outScale[2] = source[4] - source[5];

  outPos[0] = source[0] + outScale[0] / 2;
  outPos[1] = source[2] - outScale[1] / 2;
  outPos[2] = source[4] - outScale[2] / 2;
}

export function applyMat(out: box, source: box, mat: mat4): box {
  toVertices(__points, source);
  for (var i = 0; i < __pointsArray.length; i++) {
    vec3.transformMat4(__pointsArray[i], __pointsArray[i], mat);
  }
  setFromVertices(out, __points);

  return out;
}

export function clone(source: box): box {
  return new Float32Array([source[0], source[1], source[2], source[3], source[4], source[5]]) as box;
}

export function fromVecs(min: vec3, max: vec3): box {
  return clean(new Float32Array([min[0], max[0], min[1], max[1], min[2], max[2]]) as box) as box;
}

export function fromCenterSize(centerVec: vec3, sizeVec: vec3): box {
  return new Float32Array([
    centerVec[0] - sizeVec[0] / 2,
    centerVec[0] + sizeVec[0] / 2,
    centerVec[1] - sizeVec[1] / 2,
    centerVec[1] + sizeVec[1] / 2,
    centerVec[2] - sizeVec[2] / 2,
    centerVec[2] + sizeVec[2] / 2,
  ]) as box;
}

export function copy(out: box, source: box): box {
  out[0] = source[0];
  out[1] = source[1];
  out[2] = source[2];
  out[3] = source[3];
  out[4] = source[4];
  out[5] = source[5];
  return out;
}

export function setCenterSize(out: box, centerVec: vec3, sizeVec: vec3): box {
  out[0] = centerVec[0] - sizeVec[0] / 2;
  out[1] = centerVec[0] + sizeVec[0] / 2;
  out[2] = centerVec[1] - sizeVec[1] / 2;
  out[3] = centerVec[1] + sizeVec[1] / 2;
  out[4] = centerVec[2] - sizeVec[2] / 2;
  out[5] = centerVec[2] + sizeVec[2] / 2;

  return out;
}

export function clean(out: box): box {
  if (out[0] > out[1]) {
    __f = out[0];
    out[0] = out[1];
    out[1] = __f;
  }

  if (out[2] > out[3]) {
    __f = out[2];
    out[2] = out[3];
    out[3] = __f;
  }

  if (out[4] > out[5]) {
    __f = out[4];
    out[4] = out[5];
    out[5] = __f;
  }

  return out;
}

export function copyCenter(outVec: vec3, source: box): vec3 {
  outVec[0] = source[0] + (source[1] - source[0]) / 2;
  outVec[1] = source[2] + (source[3] - source[2]) / 2;
  outVec[2] = source[4] + (source[5] - source[4]) / 2;
  return outVec;
}

export function containsVec(box: box, vec: vec3): boolean {
  return !(
    vec[0] < box[0] ||
    vec[0] > box[1] ||
    vec[1] < box[2] ||
    vec[1] > box[3] ||
    vec[2] < box[4] ||
    vec[2] > box[5]
  );
}

export function reset(out: box): box {
  out[0] = out[1] = out[2] = out[3] = out[4] = out[5] = 0;

  return out;
}

export function setFromVertices(out: box, vertices: Float32Array, mat?: mat4) {
  if (vertices.length < 3) return out;

  // debugger;

  var applyMat = mat !== undefined;

  for (var i = 0; i < vertices.length; i += 3) {
    __v1[0] = vertices[i];
    __v1[1] = vertices[i + 1];
    __v1[2] = vertices[i + 2];

    if (applyMat) vec3.transformMat4(__v1, __v1, mat);

    if (i === 0) {
      out[0] = out[1] = __v1[0];
      out[2] = out[3] = __v1[1];
      out[4] = out[5] = __v1[2];
    } else {
      if (__v1[0] < out[0]) out[0] = __v1[0];

      if (__v1[0] > out[1]) out[1] = __v1[0];

      if (__v1[1] < out[2]) out[2] = __v1[1];

      if (__v1[1] > out[3]) out[3] = __v1[1];

      if (__v1[2] < out[4]) out[4] = __v1[2];

      if (__v1[2] > out[5]) out[5] = __v1[2];
    }
  }

  return out;
}

export function addMargin(out: box, marginX: number, marginY: number, marginZ: number): void {
  if (marginY === undefined) marginY = marginX;

  if (marginZ === undefined) marginZ = marginY;

  out[0] -= marginX;
  out[1] += marginX;

  out[2] -= marginY;
  out[3] += marginY;

  out[4] -= marginZ;
  out[5] += marginZ;
}

export function contains(box1: box, box2: box): boolean {
  return (
    box1[0] <= box2[0] &&
    box1[1] >= box2[1] &&
    box1[2] <= box2[2] &&
    box1[3] >= box2[3] &&
    box1[4] <= box2[4] &&
    box1[5] >= box2[5]
  );
}

export function interesects(box1: box, box2: box): boolean {
  return !(
    box2[1] < box1[0] ||
    box2[0] > box1[1] ||
    box2[3] < box1[2] ||
    box2[2] > box1[3] ||
    box2[5] < box1[4] ||
    box2[4] > box1[5]
  );
}
export function interesectsIn(box1: box, box2: box): boolean {
  return !(
    box2[1] <= box1[0] ||
    box2[0] >= box1[1] ||
    box2[3] <= box1[2] ||
    box2[2] >= box1[3] ||
    box2[5] <= box1[4] ||
    box2[4] >= box1[5]
  );
}

export function merge(out: box, box1: box, box2: box): void {
  var x0 = box1[0] < box2[0] ? box1[0] : box2[0];
  var y0 = box1[2] < box2[2] ? box1[2] : box2[2];
  var z0 = box1[4] < box2[4] ? box1[4] : box2[4];

  var x1 = box1[1] > box2[1] ? box1[1] : box2[1];
  var y1 = box1[3] > box2[3] ? box1[3] : box2[3];
  var z1 = box1[5] > box2[5] ? box1[5] : box2[5];

  out[0] = x0;
  out[1] = x1;
  out[2] = y0;
  out[3] = y1;
  out[4] = z0;
  out[5] = z1;
}

export function move(out: box, x: number, y: number, z: number): box {
  out[0] += x;
  out[1] += x;
  out[2] += y;
  out[3] += y;
  out[4] += z;
  out[5] += z;

  return out;
}
export function moveFromVec3(out: box, vec: vec3): box {
  move(out, vec[0], vec[1], vec[2]);
  return out;
}

export function moveTo(out: box, x: number, y: number, z: number): box {
  out[0] = x;
  out[2] = y;
  out[4] = z;
  return out;
}

export function moveToFromVec3(out: box, v: vec3) {
  moveTo(out, v[0], v[1], v[2]);
  return out;
}
export function setSize(out: box, width: number, height: number, depth: number): box {
  out[1] = out[0] + width;
  out[3] = out[2] + height;
  out[5] = out[4] + depth;
  return out;
}
export function setSizeFromVec3(out: box, vec: vec3): box {
  return setSize(out, vec[0], vec[1], vec[2]);
}

export function expand(out: box, x: number, y: number = x, z: number = x) {
  out[0] -= x;
  out[1] += x;
  out[2] -= y;
  out[3] += y;
  out[4] -= z;
  out[5] += z;

  return z;
}

export function intersectPlane(source: box, sPlane: plane) {
  // We compute the minimum and maximum dot product values. If those values
  // are on the same side (back or front) of the plane, then there is no intersection.

  let min: number, max: number;

  if (sPlane[0] > 0) {
    min = sPlane[0] * source[0];
    max = sPlane[0] * source[1];
  } else {
    min = sPlane[0] * source[1];
    max = sPlane[0] * source[0];
  }

  if (sPlane[1] > 0) {
    min += sPlane[1] * source[2];
    max += sPlane[1] * source[3];
  } else {
    min += sPlane[1] * source[3];
    max += sPlane[1] * source[2];
  }

  if (sPlane[2] > 0) {
    min += sPlane[2] * source[4];
    max += sPlane[2] * source[5];
  } else {
    min += sPlane[2] * source[5];
    max += sPlane[2] * source[4];
  }

  return min <= sPlane[3] && max >= sPlane[3];
}

/**
 * @class box
 */
export class box extends Float32Array {
  static create = create;
  static set = set;
  static fromValues = fromValues;
  static toVertices = toVertices;
  static updateScalePos = updateScalePos;
  static applyMat = applyMat;
  static clone = clone;
  static fromVecs = fromVecs;
  static fromCenterSize = fromCenterSize;
  static copy = copy;
  static setCenterSize = setCenterSize;
  static clean = clean;
  static copyCenter = copyCenter;
  static containsVec = containsVec;
  static reset = reset;
  static setFromVertices = setFromVertices;
  static addMargin = addMargin;
  static contains = contains;
  static interesects = interesects;
  static interesectsIn = interesectsIn;
  static merge = merge;
  static move = move;
  static moveFromVec3 = moveFromVec3;
  static moveTo = moveTo;
  static moveToFromVec3 = moveToFromVec3;
  static setSize = setSize;
  static setSizeFromVec3 = setSizeFromVec3;
  static expand = expand;
  static intersectPlane = intersectPlane;
}
