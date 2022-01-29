import {  GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { SimpleSpriteShaderState } from './SimpleSpriteShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./simple_sprite.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./simple_sprite.vert').default;


export class SimpleSpriteShader extends GLShader<SimpleSpriteShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'simple_sprite',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleSpriteShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleSpriteShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
  }
}
