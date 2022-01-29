import { mat4 } from 'gl-matrix';
import { IGLShaderState } from './IGLShaderState';

export interface IGLMVPShaderState extends IGLShaderState {
  mvp: mat4;
}
