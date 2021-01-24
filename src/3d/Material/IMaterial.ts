import { mat4 } from 'gl-matrix';
import { GLVao } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLMVPShaderState } from '../../gl/core/shader/IGLMVPShaderState';
import { Camera } from '../Camera';

export interface IMaterial<ShaderStateT extends IGLMVPShaderState = IGLMVPShaderState> {
  readonly shaderState: ShaderStateT;

  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void;

  draw(gl: AnyWebRenderingGLContext, vao: GLVao, count: number, drawType?: GLenum, drawMode?: GLenum): void;

  unbind(gl: AnyWebRenderingGLContext): void;
}
