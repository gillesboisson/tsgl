import { ICreateState } from '../shader/IGLShader';
import { ISyncUniform as IGLSyncUniform, IShaderProgram } from '../shader/IShaderProgram';
import { GLCore } from '../GLCore';
import { IGLShaderState } from '../shader/IGLShaderState';
import { GLShaderPrecompileFlags } from '../shader/GLShader';
import { compileTFProgram } from '../shader/compileProgram';

export type GLTransformFeedbackShaderStateType<ShaderStateT extends GLTransformFeedbackShaderState> = {
  new (shader: GLTransformFeedbackShader<ShaderStateT>): ShaderStateT;
};

export abstract class GLTransformFeedbackShaderState extends GLCore implements IGLShaderState {
  protected _program: WebGLProgram;
  abstract syncUniforms(): void;

  getProgram(): WebGLProgram {
    return this._program;
  }
  use(): void {
    this.gl.useProgram(this._program);
  }
  constructor(shader: GLTransformFeedbackShader<GLTransformFeedbackShaderState>) {
    super(shader.gl);
    this._program = shader.getProgram();
  }

  destroy(): void {}
}

export class GLTransformFeedbackShader<GLTransformFeedbackShaderStateT extends GLTransformFeedbackShaderState>
  extends GLCore
  implements IGLSyncUniform, IShaderProgram, ICreateState {
  protected _program: WebGLProgram;

  constructor(
    gl: WebGL2RenderingContext,
    protected vertexSrc: string,
    varyings: string[],
    bufferMode: GLenum,
    protected _shaderStateTypeClass: GLTransformFeedbackShaderStateType<GLTransformFeedbackShaderStateT>,
    attributesLocations?: { [name: string]: number },
    protected flags?: GLShaderPrecompileFlags,
  ) {
    super(gl);
    this._program = compileTFProgram(gl, vertexSrc, varyings, bufferMode, attributesLocations, flags);
  }

  syncUniforms(): void {}

  use(): void {
    this.gl.useProgram(this._program);
  }

  createState(): GLTransformFeedbackShaderState {
    return new this._shaderStateTypeClass(this);
  }

  getProgram(): WebGLProgram {
    return this._program;
  }

  destroy(): void {
    this.gl.deleteProgram(this._program);
  }
}
