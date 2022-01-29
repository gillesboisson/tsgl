import { mat4, vec3 } from 'gl-matrix';
import { plane } from './';

const __v1 = vec3.create();

const __points = new Float32Array(24);
const __pointsArray = new Array(8);

for (let i = 0; i < __pointsArray.length; i++) {
  __pointsArray[i] = new Float32Array(__points.buffer, i * 12, 3);
}

export class box extends Float32Array {
  static create(): box {
    return new Float32Array(6) as box;
  }

  static set(out: box, minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): box {
    out[0] = minX;
    out[1] = maxX;
    out[2] = minY;
    out[3] = maxY;
    out[4] = minZ;
    out[5] = maxZ;

    return out;
  }

  static fromValues(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): box {
    return new Float32Array([minX, maxX, minY, maxY, minZ, maxZ]) as box;
  }

  static toVertices(out: Float32Array, source: box): box {
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

  static updateScalePos(outPos: vec3, outScale: vec3, source: box): void {
    outScale[0] = source[1] - source[0];
    outScale[1] = source[2] - source[3];
    outScale[2] = source[4] - source[5];

    outPos[0] = source[0] + outScale[0] / 2;
    outPos[1] = source[2] - outScale[1] / 2;
    outPos[2] = source[4] - outScale[2] / 2;
  }

  static applyMat(out: box, source: box, mat: mat4): box {
    this.toVertices(__points, source);
    let i;
    for (i = 0; i < __pointsArray.length; i++) {
      vec3.transformMat4(__pointsArray[i], __pointsArray[i], mat);
    }
    this.setFromVertices(out, __points);

    return out;
  }

  static clone(source: box): box {
    return new Float32Array([source[0], source[1], source[2], source[3], source[4], source[5]]) as box;
  }

  static fromVecs(min: vec3, max: vec3): box {
    return this.clean(new Float32Array([min[0], max[0], min[1], max[1], min[2], max[2]]) as box);
  }

  static fromCenterSize(centerVec: vec3, sizeVec: vec3): box {
    return new Float32Array([
      centerVec[0] - sizeVec[0] / 2,
      centerVec[0] + sizeVec[0] / 2,
      centerVec[1] - sizeVec[1] / 2,
      centerVec[1] + sizeVec[1] / 2,
      centerVec[2] - sizeVec[2] / 2,
      centerVec[2] + sizeVec[2] / 2,
    ]) as box;
  }

  static copy(out: box, source: box): box {
    out[0] = source[0];
    out[1] = source[1];
    out[2] = source[2];
    out[3] = source[3];
    out[4] = source[4];
    out[5] = source[5];
    return out;
  }

  static setCenterSize(out: box, centerVec: vec3, sizeVec: vec3): box {
    out[0] = centerVec[0] - sizeVec[0] / 2;
    out[1] = centerVec[0] + sizeVec[0] / 2;
    out[2] = centerVec[1] - sizeVec[1] / 2;
    out[3] = centerVec[1] + sizeVec[1] / 2;
    out[4] = centerVec[2] - sizeVec[2] / 2;
    out[5] = centerVec[2] + sizeVec[2] / 2;

    return out;
  }

  static clean(out: box): box {
    if (out[0] > out[1]) {
      const x = out[0];
      out[0] = out[1];
      out[1] = x;
    }

    if (out[2] > out[3]) {
      const y = out[2];
      out[2] = out[3];
      out[3] = y;
    }

    if (out[4] > out[5]) {
      const z = out[4];
      out[4] = out[5];
      out[5] = z;
    }

    return out;
  }

  static copyCenter(outVec: vec3, source: box): vec3 {
    outVec[0] = source[0] + (source[1] - source[0]) / 2;
    outVec[1] = source[2] + (source[3] - source[2]) / 2;
    outVec[2] = source[4] + (source[5] - source[4]) / 2;
    return outVec;
  }

  static copySize(outVec: vec3, source: box): vec3 {
    outVec[0] = source[1] - source[0];
    outVec[1] = source[3] - source[2];
    outVec[2] = source[5] - source[4];
    return outVec;
  }

  static containsVec(source: box, vec: vec3): boolean {
    return !(
      vec[0] < source[0] ||
      vec[0] > source[1] ||
      vec[1] < source[2] ||
      vec[1] > source[3] ||
      vec[2] < source[4] ||
      vec[2] > source[5]
    );
  }

  static reset(out: box): box {
    out[0] = out[1] = out[2] = out[3] = out[4] = out[5] = 0;

    return out;
  }

  static setFromVertices(out: box, vertices: Float32Array, mat?: mat4): box {
    if (vertices.length < 3) return out;

    // debugger;

    const applyMat = mat !== undefined;
    let i;

    for (i = 0; i < vertices.length; i += 3) {
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

  static addMargin(out: box, marginX: number, marginY = marginX, marginZ = marginY): box {
    out[0] -= marginX;
    out[1] += marginX;

    out[2] -= marginY;
    out[3] += marginY;

    out[4] -= marginZ;
    out[5] += marginZ;

    return out;
  }

  static contains(box1: box, box2: box): boolean {
    return (
      box1[0] <= box2[0] &&
      box1[1] >= box2[1] &&
      box1[2] <= box2[2] &&
      box1[3] >= box2[3] &&
      box1[4] <= box2[4] &&
      box1[5] >= box2[5]
    );
  }

  static interesects(box1: box, box2: box): boolean {
    return !(
      box2[1] < box1[0] ||
      box2[0] > box1[1] ||
      box2[3] < box1[2] ||
      box2[2] > box1[3] ||
      box2[5] < box1[4] ||
      box2[4] > box1[5]
    );
  }

  static interesectsIn(box1: box, box2: box): boolean {
    return !(
      box2[1] <= box1[0] ||
      box2[0] >= box1[1] ||
      box2[3] <= box1[2] ||
      box2[2] >= box1[3] ||
      box2[5] <= box1[4] ||
      box2[4] >= box1[5]
    );
  }

  static merge(out: box, box1: box, box2: box): box {
    const x0 = box1[0] < box2[0] ? box1[0] : box2[0];
    const y0 = box1[2] < box2[2] ? box1[2] : box2[2];
    const z0 = box1[4] < box2[4] ? box1[4] : box2[4];

    const x1 = box1[1] > box2[1] ? box1[1] : box2[1];
    const y1 = box1[3] > box2[3] ? box1[3] : box2[3];
    const z1 = box1[5] > box2[5] ? box1[5] : box2[5];

    out[0] = x0;
    out[1] = x1;
    out[2] = y0;
    out[3] = y1;
    out[4] = z0;
    out[5] = z1;

    return out;
  }

  static move(out: box, x: number, y: number, z: number): box {
    out[0] += x;
    out[1] += x;
    out[2] += y;
    out[3] += y;
    out[4] += z;
    out[5] += z;

    return out;
  }

  static moveFromVec3(out: box, vec: vec3): box {
    this.move(out, vec[0], vec[1], vec[2]);
    return out;
  }

  static moveTo(out: box, x: number, y: number, z: number): box {
    out[0] = x;
    out[2] = y;
    out[4] = z;
    return out;
  }

  static moveToFromVec3(out: box, v: vec3): box {
    return this.moveTo(out, v[0], v[1], v[2]);
  }

  static setSize(out: box, width: number, height: number, depth: number): box {
    out[1] = out[0] + width;
    out[3] = out[2] + height;
    out[5] = out[4] + depth;
    return out;
  }

  static setSizeFromVec3(out: box, vec: vec3): box {
    return this.setSize(out, vec[0], vec[1], vec[2]);
  }

  static expand(out: box, x: number, y = x, z = x): box {
    out[0] -= x;
    out[1] += x;
    out[2] -= y;
    out[3] += y;
    out[4] -= z;
    out[5] += z;

    return out;
  }

  static intersectPlane(source: box, sPlane: plane): boolean {
    // We compute the minimum and maximum dot product values. If those values
    // are on the same side (back or front) of the plane, then there is no intersection.

    let min: number;
    let max: number;

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
}
