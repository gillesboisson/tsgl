
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { SpriteShaderState } from './SpriteShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/sprite.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/sprite.vert').default;

export class SpriteShader extends GLShader<SpriteShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'sprite',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SpriteShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SpriteShaderState, getDefaultAttributeLocation(['a_position', 'a_uv', 'a_color']));
  }
}
