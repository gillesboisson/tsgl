import { GLShaderState } from '../../gl/core/shader/GLShaderState';
import { GLShader } from '../../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../../gl/core/data/GLDefaultAttributesLocation';

const fragSrc = require('./glsl/testTFRender.frag').default;
const vertSrc = require('./glsl/testTFRender.vert').default;

export class TestTFShaderRenderState extends GLShaderState {
  syncUniforms(): void {}
}

export class TestTFShaderRender extends GLShader<TestTFShaderRenderState> {
  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TestTFShaderRenderState, getDefaultAttributeLocation(['iposition', 'ivelocity']));
  }
}
