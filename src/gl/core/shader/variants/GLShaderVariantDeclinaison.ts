import { AnyWebRenderingGLContext } from '../../GLHelpers';
import { compileProgram } from '../compileProgram';
import { getUniformsLocation } from '../getUniformsLocation';
import { createShaderVariantSlug } from './createShaderVariantSlug';
import { GLVariantDeclinaison } from './GLVariantShaderTypes';


export class GLShaderVariantDeclinaison {
  protected _program: WebGLProgram;
  protected _uniformsLocations: { [name: string]: WebGLUniformLocation; };
  protected _slug: string;

  get program(): WebGLProgram {
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
    vertexSrc: string,
    fragmentSrc: string,
    attributesLocations?: { [name: string]: number; }
  ) {
    this._slug = createShaderVariantSlug(_declinaison.values);
    try {
      this._program = compileProgram(gl, vertexSrc, fragmentSrc, attributesLocations, _declinaison.flags);
      this._uniformsLocations = getUniformsLocation(this.gl, this._program);

      // console.log(this._slug, this._uniformsLocations);
    } catch (e) {
      throw new Error('Shader variant init failed for ' + this._slug + ' : ' + e.message);
    }
  }
}
