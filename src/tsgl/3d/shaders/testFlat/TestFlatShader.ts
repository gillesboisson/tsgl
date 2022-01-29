import { GLShader, GLRenderer, AnyWebRenderingGLContext, setDefaultTextureLocation } from '../../../tsgl/gl';
import { TestFlatShaderState } from './TestFlatShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./test_flat.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./test_flat.vert').default;

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
