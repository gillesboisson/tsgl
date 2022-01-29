
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { SkyboxShaderState } from './SkyboxShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./skybox.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./skybox.vert').default;

export const SkyboxShaderID = 'skybox';

export class SkyboxShader extends GLShader<SkyboxShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SkyboxShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SkyboxShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SkyboxShaderState, getDefaultAttributeLocation(['a_position', 'a_normal']));

    setDefaultTextureLocation(this, ['u_skyboxMap']);
  }
}
