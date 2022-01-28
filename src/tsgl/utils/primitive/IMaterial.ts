import { mat4 } from 'gl-matrix';
import { GLVao } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';
import { Camera } from './Camera';

export interface IMaterial<ShaderStateT extends IGLShaderState = IGLShaderState> {
  readonly shaderState: ShaderStateT;

  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void;

  drawVao(gl: AnyWebRenderingGLContext, vao: GLVao, count: number, drawType?: GLenum, drawMode?: GLenum): void;

  unbind(gl: AnyWebRenderingGLContext): void;
}
