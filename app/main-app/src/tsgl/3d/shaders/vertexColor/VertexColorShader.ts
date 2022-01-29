import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { VertexColorShaderState } from './VertexColorShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./vertex_color.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./vertex_color.vert').default;

export class VertexColorShader extends GLShader<VertexColorShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'vertex_color',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new VertexColorShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, VertexColorShaderState, getDefaultAttributeLocation(['a_position', 'a_color']));
  }
}
