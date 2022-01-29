import { mat4 } from 'gl-matrix';
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { QuadCopyShaderState } from './QuadCopyShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./quad.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./quad.vert').default;

export const QuadCopyShaderID = 'quad_copy';

export class QuadCopyShader extends GLShader<QuadCopyShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      QuadCopyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new QuadCopyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, QuadCopyShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
