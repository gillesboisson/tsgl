import { InterleavedDataArray } from '../../gl/data/InterleavedDataArray';
import { vec2 } from 'gl-matrix';
import { TestTFdata } from './TestTFdata';
export function generateRandomData(length: number): InterleavedDataArray<TestTFdata> {
  const bufferData = new InterleavedDataArray<TestTFdata>(TestTFdata, length, TestTFdata.byteLength);
  const collection = bufferData.collection;
  for (const data of collection) {
    // vec2.set(data.position, Math.random() * 2 - 1, Math.random() * 2 - 1);
    vec2.set(data.velocity, Math.random() * 0.02 - 0.01, Math.random() * 0.04 - 0.02);
  }
  return bufferData;
}
