import { IGLShaderState } from '../IGLShaderState';
import { GLShaderVariants } from './GLShaderVariants';


export type GLShaderVariantStateType<ShaderStateT extends IGLShaderState, ValuesT> = {
  new(shader: GLShaderVariants<ShaderStateT, ValuesT>): ShaderStateT;
};
