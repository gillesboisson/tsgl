import { InterleavedDataArray } from './InterleavedDataArray';
import { IStruct } from '../../core/IStruct';
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
  allocate(arrayBuffer: ArrayBuffer, offset: number, stride: number): void;
}
