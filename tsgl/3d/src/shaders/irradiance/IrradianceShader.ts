import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { IrradianceShaderState } from './IrradianceShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/irradiance.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/irradiance.vert').default;

export const IrradianceShaderID = 'irradiance';

export class IrradianceShader extends GLShader<IrradianceShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      IrradianceShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new IrradianceShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, IrradianceShaderState, getDefaultAttributeLocation(['a_position', 'a_normal']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
