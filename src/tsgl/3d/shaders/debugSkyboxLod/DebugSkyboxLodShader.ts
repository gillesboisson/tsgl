import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../../tsgl/gl';
import { DebugSkyboxLodShaderState } from './DebugSkyboxLodShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./debugSkyboxLod.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./debugSkyboxLod.vert').default;

export const DebugSkyboxLodShaderID = 'debug_skybox_lod';

export class DebugSkyboxLodShader extends GLShader<DebugSkyboxLodShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      DebugSkyboxLodShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new DebugSkyboxLodShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, DebugSkyboxLodShaderState, getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
