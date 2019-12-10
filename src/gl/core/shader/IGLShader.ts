import { IGLCore } from '../IGLCore';
import { IGLShaderState } from './GLShaderState';
import { IUse } from './IShaderProgram';

export interface IGLShader extends IGLCore, IUse {
  // get uniforms(): GLUniformsDataT;

  createState(): IGLShaderState;
}
