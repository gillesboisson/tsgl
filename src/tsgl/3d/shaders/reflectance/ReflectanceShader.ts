import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { ReflectanceShaderState } from './ReflectanceShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./reflectance.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./reflectance.vert').default;

export const ReflectanceShaderID = 'reflectance';

export class ReflectanceShader extends GLShader<ReflectanceShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      ReflectanceShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new ReflectanceShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, ReflectanceShaderState, getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
