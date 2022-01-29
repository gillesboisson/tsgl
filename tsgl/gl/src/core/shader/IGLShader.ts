import { IGLCore } from '../IGLCore';
import { IGLShaderState } from './IGLShaderState';
import { IUse } from './IShaderProgram';

export interface ICreateState extends IGLCore, IUse {
  // get uniforms(): GLUniformsDataT;

  createState(): IGLShaderState;
}
