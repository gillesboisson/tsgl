import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { SimpleTextureShaderState } from './SimpleTextureShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./simple_texture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./simple_texture.vert').default;

export const SimpleTextureShaderID = 'simple_texture';

export class SimpleTextureShader extends GLShader<SimpleTextureShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SimpleTextureShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleTextureShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleTextureShaderState, getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
