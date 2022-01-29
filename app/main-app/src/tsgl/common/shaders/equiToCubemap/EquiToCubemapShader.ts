import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { EquiToCubemapShaderState } from './EquiToCubemapShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./equiToCubeMap.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./equiToCubeMap.vert').default;

export const EquiToCubemapShaderID = 'equi_to_cubemap';

export class EquiToCubemapShader extends GLShader<EquiToCubemapShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      EquiToCubemapShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new EquiToCubemapShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, EquiToCubemapShaderState, getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
