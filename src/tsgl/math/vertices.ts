import { AnyTypedArray, AnyTypedArrayContructor } from '../common/Type';

export type Vertices<T extends AnyTypedArray> = T[] & {
  buffer: T;
  stride: number;
};

export function createVertices<T extends AnyTypedArray = Float32Array>(
  length_data: number | number[],
  stride: number,
  ArrayType: AnyTypedArrayContructor = Float32Array,
): Vertices<T> {
  let length: number;
  let buffer: T;
  let i: number;

  if (typeof length_data === 'number') {
    length = length_data;
    buffer = new ArrayType(length * stride) as T;
  } else {
    length = length_data.length / stride;
    buffer = new ArrayType(length_data as any) as T;
  }

  const vecs = new Array(length) as Vertices<T>;
  for (i = 0; i < length; i++) {
    vecs[i] = new ArrayType(buffer.buffer, i * ArrayType.BYTES_PER_ELEMENT * stride, stride) as T;
  }

  vecs.buffer = buffer;
  vecs.stride = stride;

  return vecs;
}
