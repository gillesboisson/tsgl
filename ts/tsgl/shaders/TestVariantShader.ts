import { GLVariantShader } from '../../gl/core/shader/variants/GLVariantShader';
import { shaderVariantBoolProp } from '../../gl/core/shader/variants/shaderVariantBoolProp';
import { shaderVariantEnumProp } from '../../gl/core/shader/variants/shaderVariantEnumProp';
import { SimpleColorShaderState } from './SimpleColorShader';
import { getDefaultAttributeLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLVariantShaderState } from '../../gl/core/shader/variants/GLVariantShaderState';

const fragSrc = require('./glsl/testVariant.frag').default;
const vertSrc = require('./glsl/testVariant.vert').default;

export enum ColorMode {
  Red = 1,
  Green = 2,
  Blue = 3,
  All = 0,
}

export class TestVariantShaderState extends GLVariantShaderState {
  @shaderVariantEnumProp('SHADER_MODE', [ColorMode.Red, ColorMode.Green, ColorMode.Blue, ColorMode.All])
  colorMode: ColorMode = ColorMode.All;

  @shaderVariantBoolProp('ALPHA', 0.5, 1)
  alpha: boolean = false;

  textureInd: number;

  syncUniforms(): void {
    this.gl.uniform1i(this._uniformsLocation.texture, this.textureInd);
  }
}

export class TestVariantShader extends GLVariantShader<TestVariantShaderState> {
  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TestVariantShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
