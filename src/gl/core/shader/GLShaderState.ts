import { GLCore } from '../GLCore';
import { IGLCore } from '../IGLCore';
import { GLShader } from './GLShader';
import { getUniformsLocation } from './getUniformsLocation';
import { IGLShader } from './IGLShader';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IUse, IShaderProgram } from './IShaderProgram';

export interface IGLShaderState extends IGLCore, IShaderProgram {
  syncUniforms(): void;
  getProgram(): WebGLProgram;
}

export type GLShaderStateType<ShaderStateT extends GLShaderState> = {
  new (shader: GLShader<ShaderStateT>): ShaderStateT;
};

export abstract class GLShaderState extends GLCore implements IGLShaderState {
  protected _uniformsLocation: { [name: string]: WebGLUniformLocation };
  protected _program: WebGLProgram;

  constructor(protected _shader: GLShader<GLShaderState>) {
    super(_shader.getGL());
    this._uniformsLocation = getUniformsLocation(this.gl, _shader.program);
    this._program = _shader.program;
  }

  use() {
    this.gl.useProgram(this._program);
  }

  getProgram() {
    return this._program;
  }

  abstract syncUniforms(): void;

  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
