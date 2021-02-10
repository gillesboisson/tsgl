import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { IGLShaderState } from '../IGLShaderState';
import { GLShaderVariantDeclinaison } from './GLShaderVariantDeclinaison';
import { GLShaderVariantStateType } from './GLShaderVariantStateType';
import { GLVariantDeclinaison, GLVariantValueDefinition } from './GLVariantShaderTypes';
import { valueDefinitionsToVariantDeclinaison } from './valueDefinitionsToVariantDeclinaison';

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
  ) {
    this._declinaisons = valueDefinitionsToVariantDeclinaison(this.valueDefinitions);
    this._shaders = {};
    this._declinaisons
      .map((dcl) => new GLShaderVariantDeclinaison(this.gl, dcl, this.vertexSrc, this.fragmentSrc, attributesLocations))
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

  getProgramFromSlug(slug: string): WebGLProgram {
    return this._shaders[slug]?.program;
  }

  createState(): ShaderStateT {
    return new this._shaderStateTypeClass(this);
  }
}
