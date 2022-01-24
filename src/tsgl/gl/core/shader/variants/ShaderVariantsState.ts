import { GLCore } from '../../GLCore';
import { IGLShaderState } from '../IGLShaderState';
import { createShaderVariantSlug } from './createShaderVariantSlug';
import { defaultValues } from './defaultValues';
import { GLShaderVariantDeclinaison } from './GLShaderVariantDeclinaison';
import { GLShaderVariants } from './GLShaderVariants';
import { GLShaderVariantKeyValue } from './GLVariantShaderTypes';

export abstract class ShaderVariantsState<ValuesT> extends GLCore implements IGLShaderState {
  protected _variantValues: GLShaderVariantKeyValue;
  private _dirtyVariant: boolean;
  protected _variantShader: GLShaderVariantDeclinaison;

  get dirtyVariant(): boolean {
    return this._dirtyVariant;
  }

  constructor(protected _shader: GLShaderVariants<ShaderVariantsState<ValuesT>, ValuesT>) {
    super(_shader.gl);
    this._variantValues = defaultValues(_shader.valueDefinitions);
    this._dirtyVariant = true;
  }

  setVariantValue(name: string, val: string | boolean): void {
    if (this._variantValues[name] !== val) {
      this._variantValues[name] = val;
      this._dirtyVariant;
    }
  }

  getVariantValue(name: string): string | boolean {
    return this._variantValues[name];
  }

  sync(): void {
    if (this._dirtyVariant === true) {
      const slug = createShaderVariantSlug(this._variantValues);
      this._variantShader = this._shader.getDeclinaison(slug);
      this._dirtyVariant = false;
    }
  }

  use(): void {
    this.sync();
    this.gl.useProgram(this._variantShader.program);
  }

  getProgram(): WebGLProgram {
    this.sync();
    return this._variantShader?.program;
  }

  abstract syncUniforms(): void;

  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
