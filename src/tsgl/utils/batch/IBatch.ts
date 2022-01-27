import { Camera } from '../../3d/Camera';
import { IGLShaderState } from '../../gl';

export interface IBatch<PullableT, MainShaderStateT extends IGLShaderState = IGLShaderState> {
  begin<ShaderStateT extends MainShaderStateT>(shaderState: ShaderStateT, cam?: Camera): void;
  push(nbIndices: number, nbVertex: number, texture: WebGLTexture, pullable: PullableT): void;
  changeShader<ShaderStateT extends MainShaderStateT>(shaderState: ShaderStateT): void;
  end(): void;
}
