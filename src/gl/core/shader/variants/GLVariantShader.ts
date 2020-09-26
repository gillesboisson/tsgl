import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { GLCore } from '../../GLCore';

import { ICreateState } from '../IGLShader';
import { GLShaderPrecompileFlags } from '../GLShader';
import { getDeclinaison } from './getDeclinaison';
import { GLVariantShaderState, GLVariantShaderStateType } from './GLVariantShaderState';
import { compileDeclinaison } from './compileDeclinaison';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum VariantColor {
  GREEN = 1,
  RED = 2,
  BLUE = 3,
  ALL = 4,
}

export type VariantDefinition = {
  [name: string]: {
    flagName: string;
    possibleValues: (string | null)[];
  };
};

export type VariantDeclinaison = {
  variantKey: string[];
  variantValue: any[];
  flags: GLShaderPrecompileFlags;
  program: WebGLProgram;
  uniformsLocation: { [name: string]: WebGLUniformLocation };
};

export class GLVariantShader<VariantStateT extends GLVariantShaderState> extends GLCore implements ICreateState {
  public get possibleVariants(): VariantDeclinaison[] {
    return this._possibleVariants;
  }

  constructor(
    gl: AnyWebRenderingGLContext,
    protected vertexSrc: string,
    protected fragmentSrc: string,
    protected _shaderTypeClass: GLVariantShaderStateType<VariantStateT>,
    attributesLocations?: { [name: string]: number },
    protected flags?: GLShaderPrecompileFlags,
  ) {
    super(gl);
    this._possibleVariants = getDeclinaison(_shaderTypeClass.prototype.__variantsDefinition, flags);
    compileDeclinaison(gl, this._possibleVariants, vertexSrc, fragmentSrc, attributesLocations);
  }

  createState(): VariantStateT {
    return new this._shaderTypeClass(this);
  }

  // define with decorators
  // private __variantsDefinition: VariantDefinition;
  // private __variantsValues: any[];

  protected _possibleVariants: VariantDeclinaison[];

  destroy(): void {
    const gl = this.gl;
    for (const variant of this._possibleVariants) {
      gl.deleteProgram(variant.program);
      delete variant.program;
    }

    // delete this.__variantsDefinition;
    // delete this.__variantsValues;
    delete this._possibleVariants;
  }
  use(): void {}
}
