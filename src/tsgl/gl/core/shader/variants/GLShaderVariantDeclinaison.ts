import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { compileProgram } from '../compileProgram';
import { getUniformsLocation } from '../getUniformsLocation';
import { IGLShaderState } from '../IGLShaderState';
import { createShaderVariantSlug } from './createShaderVariantSlug';
import { GLShaderVariants } from './GLShaderVariants';
import { GLVariantDeclinaison } from './GLVariantShaderTypes';


export class GLShaderVariantDeclinaison {
  protected _program: WebGLProgram;
  protected _uniformsLocations: { [name: string]: WebGLUniformLocation; };
  protected _slug: string;
  
  get program(): WebGLProgram {
    if(!this._program && this._shader.buildOnDemand){
      this.build();
    }
    return this._program;
  }
  get uniformsLocation(): { [name: string]: WebGLUniformLocation; } {
    return this._uniformsLocations;
  }

  get slug(): string {
    return this._slug;
  }

  constructor(
    readonly gl: AnyWebRenderingGLContext,
    protected _declinaison: GLVariantDeclinaison,
    private _vertexSrc: string,
    private _fragmentSrc: string,
    private _shader: GLShaderVariants<IGLShaderState, any>,
    private _attributesLocations?: { [name: string]: number; }
  ) {
    this._slug = createShaderVariantSlug(_declinaison.values);
    if(_shader.buildOnDemand === false){
      this.build();
    }
  }

  build(): void{
    try {
      this._program = compileProgram(this.gl, this._vertexSrc, this._fragmentSrc, this._attributesLocations, this._declinaison.flags);
      this._uniformsLocations = getUniformsLocation(this.gl, this._program);
      this._shader.programBuilt(this,this._program);
      // console.log(this._slug, this._uniformsLocations);
    } catch (e) {
      console.error('Shader variant error',this._slug, e.message);
      throw new Error('Shader variant init failed for ' + this._slug + ' : ' + e.message);
    }
  }
}
