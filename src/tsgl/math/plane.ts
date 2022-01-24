import { mat3, mat4, vec3 } from 'gl-matrix';
import { box } from './box';

const __v1 = vec3.create();
const __v2 = vec3.create();
const __t = 0.0;

const __m3_1 = mat3.create();

export class plane extends Float32Array {
  static create(): plane {
    return new Float32Array(4) as plane;
  }

  static fromValues(x: number, y: number, z: number, w: number) {
    return new Float32Array([x, y, z, w]);
  }

  static clone(source: plane) {
    return new Float32Array([source[0], source[1], source[2], source[3]]) as plane;
  }

  static set(out: plane, x: number, y: number, z: number, w: number): plane {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;

    return out;
  }

  static fromVecWeight(vec: vec3, w: number) {
    return new Float32Array([vec[0], vec[1], vec[2], w]);
  }

  static copy(out: plane, source: plane): plane {
    out[0] = source[0];
    out[1] = source[1];
    out[2] = source[2];
    out[3] = source[3];
    return out;
  }

  static normalize(out: plane) {
    const inverseNormalLength = 1.0 / vec3.length(out as any);

    out[0] *= inverseNormalLength;
    out[1] *= inverseNormalLength;
    out[2] *= inverseNormalLength;
    out[3] *= inverseNormalLength;

    return out;
  }

  static negate(out: plane): plane {
    out[0] *= -1;
    out[1] *= -1;
    out[2] *= -1;
    out[3] *= -1;

    return out;
  }
  static distanceToVec(source: plane, vec: vec3): number {
    return vec3.dot(source as any, vec) + source[3];
  }

  static projectVec(out: plane, sourcePlane: plane, vec: vec3): plane {
    vec3.copy(out as any, sourcePlane as any); // copy normal
    vec3.scale(out as any, out as any, this.distanceToVec(sourcePlane, vec));
    vec3.add(out as any, out as any, vec);

    return out;
  }

  static coplanarVec(outVec: vec3, source: plane): plane {
    vec3.copy(outVec, source as any);

    vec3.scale(outVec, outVec, -source[3]);

    return outVec;
  }

  static applyMat4(out: plane, mat: mat4, normalMat: mat3): plane {
    if (normalMat === undefined) {
      normalMat = __m3_1;
      mat3.normalFromMat4(normalMat, mat);
    }

    const referenceVec = __v1;

    this.coplanarVec(referenceVec, out);

    vec3.transformMat4(referenceVec, referenceVec, mat);
    vec3.transformMat3(out as any, out as any, normalMat);

    vec3.normalize(out as any, out as any);
    out[3] = -vec3.dot(referenceVec, out as any);

    return out;
  }

  static translate(out: plane, offset: vec3): plane {
    out[3] -= vec3.dot(offset, out as any);

    // this.constant -= offset.dot( this.normal );

    return out;
  }

  static equals(plane1: plane, plane2: plane): boolean {
    return plane1[0] === plane2[0] && plane1[1] === plane2[1] && plane1[2] === plane2[2] && plane1[3] === plane2[3];

    // return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );
  }

  static intersectsBox(source: plane, sBox: box): boolean {
    return box.intersectPlane(sBox, source);
  }

  // TODO:implement
  // static intersectLine(out, sourcePlane, lineVec1, lineVec2) {}

  // TODO:implement
  // static intersectsLine(sourcePlane, lineVec1, lineVec2) {}
}
