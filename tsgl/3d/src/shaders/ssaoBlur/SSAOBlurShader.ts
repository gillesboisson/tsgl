import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { SSAOBlurShaderState } from './SSAOBlurShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/ssaoBlur.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/ssaoBlur.vert').default;

export const SSAOBlurShaderID = 'ssao_blur';

export class SSAOBlurShader extends GLShader<SSAOBlurShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SSAOBlurShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SSAOBlurShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SSAOBlurShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));

    setDefaultTextureLocation(this, ['u_texture']);
  }
}
