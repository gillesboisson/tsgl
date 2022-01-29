import { mat4 } from 'gl-matrix';
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { HDRPrepassShaderState } from './HDRPrepassShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./hdrPrepass.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./hdrPrepass.vert').default;

export const HDRPrepassShaderID = 'hdr_prepass';

export class HDRPrepassShader extends GLShader<HDRPrepassShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      HDRPrepassShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new HDRPrepassShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, HDRPrepassShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
