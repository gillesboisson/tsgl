import { GLCore } from '../GLCore';
import { GLShader } from './GLShader';
import { getUniformsLocation } from './getUniformsLocation';
import { ICreateState } from './IGLShader';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IUse } from './IShaderProgram';
import { IGLShaderState } from './IGLShaderState';

export abstract class GLShaderState extends GLCore implements IGLShaderState {
  protected _uniformsLocation: { [name: string]: WebGLUniformLocation };
  protected _program: WebGLProgram;

  constructor(protected _shader: GLShader<GLShaderState>) {
    super(_shader.getGL());
    const program = _shader.getProgram();
    this._uniformsLocation = getUniformsLocation(this.gl, program);
    this._program = program;
  }

  use() {
    this.gl.useProgram(this._program);
  }

  getProgram() {
    return this._program;
  }

  abstract syncUniforms(): void;

  start() {
    this.gl.useProgram(this._program);
    this.syncUniforms();
  }

  stop() {
    this.gl.useProgram(null);
  }

  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
