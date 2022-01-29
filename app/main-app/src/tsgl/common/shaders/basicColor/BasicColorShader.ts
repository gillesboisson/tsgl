import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { BasicColorShaderState } from './BasicColorShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./basicColor.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./basicColor.vert').default;

export const BasicColorShaderID = 'basic_color';

export class BasicColorShader extends GLShader<BasicColorShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BasicColorShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BasicColorShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BasicColorShaderState, getDefaultAttributeLocation(['a_position']));
  }
}
