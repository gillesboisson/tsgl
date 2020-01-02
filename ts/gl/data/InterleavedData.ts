import { vec2, vec3, vec4 } from 'gl-matrix';
import { Type } from '../../core/Type';
import { IInterleaveData } from './IInterleaveData';
import { IStruct } from '../../core/IStruct';

export interface WithUv {
  uv: vec2;
}

export interface WithPosition {
  position: vec3;
}

export interface WithColor {
  color: vec4;
}

export interface InterleavedDataType<T extends IInterleaveData> extends Function {
  new (...args: any): T;
  byteLength: number;
}
