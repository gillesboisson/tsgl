import { IGLCore } from '../IGLCore';
import { IGLShaderState } from './IGLShaderState';
import { IUse, IShaderProgram } from './IShaderProgram';
import { GLRenderer } from '../GLRenderer';

export interface ICreateState extends IGLCore, IUse {
  // get uniforms(): GLUniformsDataT;

  createState(): IGLShaderState;
}

export interface IShaderFactoryType extends Function {
  registerShader(renderer: GLRenderer<any>): void;
}
