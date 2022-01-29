import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { SimplePBRShaderState } from './SimplePBRShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./pbrSimple.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./pbrSimple.vert').default;

export const SimplePBRShaderID = 'simple_pbr';

export class SimplePBRShader extends GLShader<SimplePBRShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SimplePBRShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimplePBRShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimplePBRShaderState, getDefaultAttributeLocation(['a_position', 'a_uv', 'a_normal']));

    setDefaultTextureLocation(this, ['u_irradianceMap', 'u_reflexionMap', 'u_brdfLut']);
  }
}
