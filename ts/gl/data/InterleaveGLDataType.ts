import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLBuffer } from '../core/data/GLBuffer';
import { GLAttribute } from '../core/data/GLAttribute';
import { IInterleaveData } from './IInterleaveData';
import { IStruct } from './IStruct';
export interface InterleaveGLDataType<DataT extends IInterleaveData> extends IStruct {
  createAttributes?: (gl: AnyWebRenderingGLContext, buffer: GLBuffer, stride: number) => GLAttribute[];
  new (): DataT;
}
