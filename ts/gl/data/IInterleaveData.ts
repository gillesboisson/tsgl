import { InterleavedDataArray } from './InterleavedDataArray';
/*
export interface InterleavedProp {
  name?: string;
  type: any;
  offset?: number;
  length?: number;
  attributeName?: string;
  attributeLocation?: number;
  attributeType?: (gl: AnyWebRenderingGLContext) => GLenum;
  attributeNormalize?: boolean;
  useAccessor?: boolean;
}
*/
export interface IInterleaveData {
  allocate(
    array: InterleavedDataArray<IInterleaveData>,
    arrayBuffer: ArrayBuffer,
    offset: number,
    stride: number,
  ): void;
}
