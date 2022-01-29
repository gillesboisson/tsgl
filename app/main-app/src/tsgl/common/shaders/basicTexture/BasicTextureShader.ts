import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { BasicTextureShaderState } from './BasicTextureShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./basicTexture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./basicTexture.vert').default;

export const BasicTextureShaderID = 'basic_texture';

export class BasicTextureShader extends GLShader<BasicTextureShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BasicTextureShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BasicTextureShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BasicTextureShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
