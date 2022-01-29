import { IGLCore } from '../IGLCore';
import { IShaderProgram, ISyncUniform } from './IShaderProgram';
export interface IGLShaderState extends IGLCore, IShaderProgram, ISyncUniform {
  syncUniforms(): void;
  getProgram(): WebGLProgram;
}
