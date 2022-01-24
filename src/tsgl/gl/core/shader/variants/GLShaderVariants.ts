import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { IGLShaderState } from '../IGLShaderState';
import { GLShaderVariantDeclinaison } from './GLShaderVariantDeclinaison';
import { GLShaderVariantStateType } from './GLShaderVariantStateType';
import { GLVariantDeclinaison, GLVariantValueDefinition } from './GLVariantShaderTypes';
import { valueDefinitionsToVariantDeclinaison } from './valueDefinitionsToVariantDeclinaison';

// define if all declinaison is prebuild on construct
// or build separatly when declinaison is requested the first time
// eslint-disable-next-line prefer-const
const DEFAULT_BUILD_ON_DEMAND = true;

export class GLShaderVariants<ShaderStateT extends IGLShaderState, ValuesT> {
  private _declinaisons: GLVariantDeclinaison[];
  private _shaders: { [slug: string]: GLShaderVariantDeclinaison };

  constructor(
    readonly gl: AnyWebRenderingGLContext,
    protected vertexSrc: string,
    protected fragmentSrc: string,
    protected _shaderStateTypeClass: GLShaderVariantStateType<ShaderStateT, ValuesT>,
    readonly valueDefinitions: { [name: string]: GLVariantValueDefinition[] },
    attributesLocations?: { [name: string]: number },
    readonly buildOnDemand = DEFAULT_BUILD_ON_DEMAND,
  ) {
    this._declinaisons = valueDefinitionsToVariantDeclinaison(this.valueDefinitions);
    this._shaders = {};
    this._declinaisons
      .map(
        (dcl) =>
          new GLShaderVariantDeclinaison(this.gl, dcl, this.vertexSrc, this.fragmentSrc, this, attributesLocations),
      )
      .forEach((shader) => (this._shaders[shader.slug] = shader));
  }

  getDeclinaison(slug: string, orFail = true): GLShaderVariantDeclinaison {
    const declinaison = this._shaders[slug];
    if (orFail === true && !declinaison) throw new Error('Failed to get shader declinaison for ' + slug);
    return declinaison;
  }

  get shaders(): { [slug: string]: GLShaderVariantDeclinaison } {
    return { ...this._shaders };
  }

  // program build hook called from GLShaderVariantDeclinaison when it is build, it can overriden in order to set common v shader uniform settings (eg. texture location)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  programBuilt(declinaison: GLShaderVariantDeclinaison, program: WebGLProgram): void {}

  getProgramFromSlug(slug: string): WebGLProgram {
    return this._shaders[slug]?.program;
  }

  createState(): ShaderStateT {
    return new this._shaderStateTypeClass(this);
  }
}
