import { GLCore } from '../GLCore';
import { GLShader } from './GLShader';
import { getUniformsLocation } from './getUniformsLocation';
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

  use(): void {
    this.gl.useProgram(this._program);
  }

  getProgram(): WebGLProgram {
    return this._program;
  }

  abstract syncUniforms(): void;

  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
