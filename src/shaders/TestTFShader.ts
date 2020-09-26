import { GLTransformFeedbackShader, GLTransformFeedbackShaderState } from '../gl/core/data/GLTFShader';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shaderSrc = require('./glsl/testTF.vert').default;

export class TestTFShaderState extends GLTransformFeedbackShaderState {
  syncUniforms(): void {}
}

export class TestTFShader extends GLTransformFeedbackShader<TestTFShaderState> {
  constructor(gl: WebGL2RenderingContext) {
    super(
      gl,
      shaderSrc,
      ['oposition', 'ovelocity'],
      gl.INTERLEAVED_ATTRIBS,
      TestTFShaderState,
      getDefaultAttributeLocation(['iposition', 'ivelocity']),
    );
  }
}
