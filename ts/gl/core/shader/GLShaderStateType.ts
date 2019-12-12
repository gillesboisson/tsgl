import { GLShader } from './GLShader';
import { GLShaderState } from './GLShaderState';
export type GLShaderStateType<ShaderStateT extends GLShaderState> = {
  new (shader: GLShader<ShaderStateT>): ShaderStateT;
};
