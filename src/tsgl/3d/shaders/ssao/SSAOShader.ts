import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../../tsgl/gl';
import { SSAOShaderState } from './SSAOShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./ssao.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./ssao.vert').default;

export const SSAOShaderID = 'ssao';

export class SSAOShader extends GLShader<SSAOShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SSAOShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SSAOShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SSAOShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));

    setDefaultTextureLocation(this, ['u_normalMap', 'u_positionMap', 'u_depthMap', 'u_ssaoRotationMap']);
  }
}
