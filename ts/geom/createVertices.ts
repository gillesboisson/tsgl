import { TypedArray, TypedArrayType } from '../core/TypedArray';

export class VerticesArray<T> extends Array {
  buffer: T;
  stride: number;
}

export function createVertices<T>(
  length_data: number | any[],
  nbSubElements: number,
  ArrayType: TypedArrayType = Float32Array,
) {
  let length;
  let buffer;

  if (typeof length_data === 'number') {
    length = length_data;
    buffer = new ArrayType(length * nbSubElements);
  } else {
    length = length_data.length / nbSubElements;
    buffer = new ArrayType(length_data);
  }

  const vecs = new Array(length) as VerticesArray<T>;
  for (var i = 0; i < length; i++) {
    vecs[i] = new ArrayType(buffer.buffer, i * ArrayType.BYTES_PER_ELEMENT * nbSubElements, nbSubElements);
  }

  vecs.buffer = (<unknown>buffer) as T;
  vecs.stride = nbSubElements;

  return vecs;
}
