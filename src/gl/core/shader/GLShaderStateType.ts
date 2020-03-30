import { GLShader } from './GLShader';
import { GLShaderState } from './GLShaderState';
import { IGLShaderState } from './IGLShaderState';
export type GLShaderStateType<ShaderStateT extends IGLShaderState> = {
  new (shader: GLShader<ShaderStateT>): ShaderStateT;
};
