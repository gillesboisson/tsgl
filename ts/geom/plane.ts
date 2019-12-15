import { box } from './box';
import { vec3, mat3, mat4 } from 'gl-matrix';

// methods shortcut

const box_intersectPlane = box.intersectPlane;
const mat3_create = mat3.create;
const mat3_normalFromMat4 = mat3.normalFromMat4;
const vec3_create = vec3.create;
const vec3_length = vec3.length;
const vec3_dot = vec3.dot;
const vec3_copy = vec3.copy;
const vec3_scale = vec3.scale;
const vec3_add = vec3.add;
const vec3_transformMat4 = vec3.transformMat4;
const vec3_transformMat3 = vec3.transformMat3;
const vec3_normalize = vec3.normalize;

const __v1 = vec3_create();
const __v2 = vec3_create();
const __t = 0.0;

const __m3_1 = mat3_create();

export function create(): plane {
  return new Float32Array(4) as plane;
}

export function fromValues(x: number, y: number, z: number, w: number) {
  return new Float32Array([x, y, z, w]);
}

export function clone(source: plane): plane {
  return new Float32Array([source[0], source[1], source[2], source[3]]) as plane;
}

export function set(out: plane, x: number, y: number, z: number, w: number): plane {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;

  return out;
}

export function fromVecWeight(vec: vec3, w: number): plane {
  return new Float32Array([vec[0], vec[1], vec[2], w]) as plane;
}

export function copy(out: plane, source: plane): plane {
  out[0] = source[0];
  out[1] = source[1];
  out[2] = source[2];
  out[3] = source[3];
  return out;
}

export function normalize(out: plane): plane {
  const inverseNormalLength = 1.0 / vec3_length(out as vec3);

  out[0] *= inverseNormalLength;
  out[1] *= inverseNormalLength;
  out[2] *= inverseNormalLength;
  out[3] *= inverseNormalLength;

  return out;
}

export function negate(out: plane): plane {
  out[0] *= -1;
  out[1] *= -1;
  out[2] *= -1;
  out[3] *= -1;

  return out;
}
export function distanceToVec(source: plane, vec: vec3): number {
  return vec3_dot(source as vec3, vec) + source[3];
}

export function projectVec(out: plane, sourcePlane: plane, vec: vec3): plane {
  vec3_copy(out as vec3, sourcePlane as vec3); // copy normal
  vec3_scale(out as vec3, out as vec3, distanceToVec(sourcePlane, vec));
  vec3_add(out as vec3, out as vec3, vec);

  return out;
}

export function coplanarVec(outVec: vec3, source: plane): vec3 {
  // console.log('source : ', source);

  vec3_copy(outVec, source as vec3);
  // console.log('outVec : ', outVec);

  vec3_scale(outVec, outVec, -source[3]);

  // console.log('outVec : ', outVec);

  // return result.copy( normal ).multiplyScalar( - constant );

  return outVec;
}

export function applyMat4(out: plane, mat: mat4, normalMat?: mat3) {
  if (normalMat === undefined) {
    normalMat = __m3_1;
    mat3_normalFromMat4(normalMat, mat);
  }

  const referenceVec = __v1;

  coplanarVec(referenceVec, out);

  vec3_transformMat4(referenceVec, referenceVec, mat);
  vec3_transformMat3(out as vec3, out as vec3, normalMat);

  vec3_normalize(out as vec3, out as vec3);
  out[3] = -vec3_dot(referenceVec, out as vec3);

  return out;
}

export function translate(out: plane, offset: vec3): plane {
  out[3] -= vec3_dot(offset, out as vec3);
  return out;
}

export function equals(plane1: plane, plane2: plane): boolean {
  return plane1[0] === plane2[0] && plane1[1] === plane2[1] && plane1[2] === plane2[2] && plane1[3] === plane2[3];
}

export function intersectsBox(source: plane, sBox: box): boolean {
  return box_intersectPlane(sBox, source);
}

// TODO:implement
// intersectLine(out, sourcePlane, lineVec1, lineVec2) {}

// TODO:implement
// intersectsLine(sourcePlane, lineVec1, lineVec2) {}

export class plane extends Float32Array {
  static create = create;
  static fromValues = fromValues;
  static clone = clone;
  static set = set;
  static fromVecWeight = fromVecWeight;
  static copy = copy;
  static normalize = normalize;
  static negate = negate;
  static distanceToVec = distanceToVec;
  static projectVec = projectVec;
  static coplanarVec = coplanarVec;
  static applyMat4 = applyMat4;
  static translate = translate;
  static equals = equals;
  static intersectsBox = intersectsBox;
}
