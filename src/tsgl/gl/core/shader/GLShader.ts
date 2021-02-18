import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLCore, GLType } from '../GLCore';
import { ICreateState } from './IGLShader';
import { compileProgram } from './compileProgram';
import { GLShaderStateType } from './GLShaderStateType';
import { IShaderCreateState, IShaderProgram, ISyncUniform } from './IShaderProgram';
import { IGLShaderState } from './IGLShaderState';
import { GLRenderer } from '../GLRenderer';
import { getUniformsLocation } from './getUniformsLocation';

export type GLShaderPrecompileFlags = {
  [key: string]: string | boolean;
};

export interface IShaderRegisterer {
  register(renderer: GLRenderer): void;
}



export class GLShader<ShaderStateT extends IGLShaderState>
  extends GLCore
  implements ICreateState, IShaderProgram, ISyncUniform, IShaderCreateState<ShaderStateT> {
  protected _program: WebGLProgram;
  protected _state: ShaderStateT;

  glType = GLType.Shader;
  protected _uniformsLocations: { [name: string]: WebGLUniformLocation };

  constructor(
    gl: AnyWebRenderingGLContext,
    protected vertexSrc: string,
    protected fragmentSrc: string,
    protected _shaderStateTypeClass: GLShaderStateType<ShaderStateT>,
    attributesLocations?: { [name: string]: number },
    protected flags?: GLShaderPrecompileFlags,
  ) {
    super(gl);
    this._program = compileProgram(gl, vertexSrc, fragmentSrc, attributesLocations, flags);

    this._uniformsLocations = getUniformsLocation(this.gl, this._program);
  }

  getUniformsLocations(): { [name: string]: WebGLUniformLocation } {
    return this._uniformsLocations;
  }

  createState(): ShaderStateT {
    return new this._shaderStateTypeClass(this);
  }

  getProgram(): WebGLProgram {
    return this._program;
  }

  use(): void {
    this.gl.useProgram(this._program);
  }

  destroy(): void {
    this.gl.deleteProgram(this._program);
  }

  syncUniforms(): void {}
}
