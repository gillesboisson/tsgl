import { IGLShaderState } from '../../gl';
import { Camera } from '../primitive/Camera';

export interface IBatch<PullableT, MainShaderStateT extends IGLShaderState = IGLShaderState> {
  begin<ShaderStateT extends MainShaderStateT>(shaderState: ShaderStateT, cam?: Camera): void;
  push(nbIndices: number, nbVertex: number, texture: WebGLTexture, pullable: PullableT): void;
  changeShader<ShaderStateT extends MainShaderStateT>(shaderState: ShaderStateT): void;
  end(): void;
}
