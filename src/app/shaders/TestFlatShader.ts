import { mat4 } from 'gl-matrix';
import { setDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLShader } from '../../gl/core/shader/GLShader';
import { GLShaderState } from '../../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/test_flat.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../../shaders/glsl/flat_2d.vert').default;

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