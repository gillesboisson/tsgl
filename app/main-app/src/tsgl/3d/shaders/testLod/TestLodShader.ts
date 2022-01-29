import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { TestLodShaderState } from './TestLodShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./testLodTexture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./testLodTexture.vert').default;


export const TestLodShaderID = 'lod_test';

export class TestLodShader extends GLShader<TestLodShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      TestLodShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new TestLodShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TestLodShaderState,getDefaultAttributeLocation(['a_position','a_uv']));
    setDefaultTextureLocation(this,['u_texture']);
  }
}
