import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLCore } from '../GLCore';
import { IGLShader } from './IGLShader';
import { compileProgram } from './compileProgram';
import { GLShaderState, GLShaderStateType } from './GLShaderState';
import { IShaderProgram, ISyncUniform } from './IShaderProgram';

export type GLShaderPrecompileFlags = {
  [key: string]: string;
};

export class GLShader<ShaderStateT extends GLShaderState> extends GLCore
  implements IGLShader, IShaderProgram, ISyncUniform {
  protected _program: WebGLProgram;
  protected _state: ShaderStateT;

  constructor(
    gl: AnyWebRenderingGLContext,
    protected vertexSrc: string,
    protected fragmentSrc: string,
    protected _shaderTypeClass: GLShaderStateType<ShaderStateT>,
    attributesLocations?: { [name: string]: number },
    protected flags?: GLShaderPrecompileFlags,
  ) {
    super(gl);
    this._program = compileProgram(gl, vertexSrc, fragmentSrc, attributesLocations, flags);
  }

  createState(): ShaderStateT {
    return new this._shaderTypeClass(this);
  }

  getProgram() {
    return this._program;
  }

  use() {
    this.gl.useProgram(this._program);
  }

  destroy() {
    this.gl.deleteProgram(this._program);
  }

  syncUniforms(): void {}
}
