import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { SSRShaderState } from './SSRShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./ssr.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./ssr.vert').default;

export const SSRShaderID = 'ssr';

export class SSRShader extends GLShader<SSRShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SSRShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SSRShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SSRShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));

    setDefaultTextureLocation(this, ['u_normalMap', 'u_positionMap', 'u_depthMap', 'u_texture']);
  }
}
