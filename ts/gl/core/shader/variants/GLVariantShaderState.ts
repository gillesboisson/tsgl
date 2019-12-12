import { GLVariantShader, VariantDeclinaison, VariantDefinition } from './GLVariantShader';
import { ICreateState } from '../IGLShader';
import { GLCore } from '../../GLCore';
import { IGLShaderState } from '../IGLShaderState';
import { AnyWebRenderingGLContext } from '../../GLHelpers';

export abstract class GLVariantShaderState extends GLCore implements IGLShaderState {
  getProgram(): WebGLProgram {
    if (this._dirtyVariant === true) {
      const values = this.__variantsValues;
      const possibleVariants = this._possibleVariants;
      const nbValues = values.length;

      for (let f = 0; f < possibleVariants.length; f++) {
        const variant = possibleVariants[f];

        for (let i = 0; i < nbValues; i++) {
          if (values[i] !== variant.variantValue[i]) {
            break;
          } else if (i === nbValues - 1) {
            this._activeProgram = variant.program;
            this._uniformsLocation = variant.uniformsLocation;
            this._dirtyVariant = false;
            return this._activeProgram;
          }
        }
      }

      throw new Error('Shader program not found for current variant');
    } else {
      return this._activeProgram;
    }
  }

  private __variantsValues: any[];
  private __variantsDefinition: VariantDefinition;
  shader: GLVariantShader<GLVariantShaderState>;

  protected _activeProgram: WebGLProgram;
  protected _dirtyVariant: boolean;
  protected _possibleVariants: VariantDeclinaison[];
  protected _uniformsLocation: { [name: string]: WebGLUniformLocation };

  constructor(protected _shaderVariant: GLVariantShader<GLVariantShaderState>) {
    super(_shaderVariant.getGL());
    this._possibleVariants = _shaderVariant.possibleVariants;
  }

  use(): void {
    this.gl.useProgram(this.getProgram());
  }

  destroy(): void {
    delete this._activeProgram;
    delete this._possibleVariants;
    delete this._shaderVariant;
    delete this.__variantsValues;
  }

  abstract syncUniforms(): void;
}

export type GLVariantShaderStateType<GLShaderVariantStateT extends GLVariantShaderState> = {
  new (shader: GLVariantShader<GLShaderVariantStateT>): GLShaderVariantStateT;
};
