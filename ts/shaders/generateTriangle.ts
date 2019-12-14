import { InterleavedDataArray } from '../gl/data/InterleavedDataArray';
import { vec2 } from 'gl-matrix';
import { TestTFdata } from './TestTFdata';
export function generateTriangle(): InterleavedDataArray<TestTFdata> {
  const bufferData = new InterleavedDataArray<TestTFdata>(TestTFdata, 3, TestTFdata.byteLength);
  const collection = bufferData.collection;
  vec2.set(collection[0].position, -1, -1);
  vec2.set(collection[1].position, 1, -1);
  vec2.set(collection[2].position, -1, 1);
  vec2.set(collection[0].velocity, 0, 0);
  vec2.set(collection[1].velocity, 0, 0);
  vec2.set(collection[2].velocity, 0, 0);
  return bufferData;
}
