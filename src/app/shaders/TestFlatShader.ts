import { setDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';
import { IGLShaderState } from '../../tsgl/gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/test_flat.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../../tsgl/shaders/glsl/flat_2d.vert').default;

export class TestFlatShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {}
}

export const TestFlatID = 'test_flat';

export class TestFlatShader extends GLShader<TestFlatShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      TestFlatID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new TestFlatShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TestFlatShaderState);
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
