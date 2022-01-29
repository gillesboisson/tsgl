import { GLShader, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { SimpleColorShaderState } from './SimpleColorShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/simpleColor.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/simpleColor.vert').default;

export class SimpleColorShader extends GLShader<SimpleColorShaderState> {
  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleColorShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
