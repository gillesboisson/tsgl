import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { BrdfLutShaderState } from './BrdfLutShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/brdfLut.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/brdfLut.vert').default;

export const BrdfLutShaderID = 'brdf_lut';

export class BrdfLutShader extends GLShader<BrdfLutShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BrdfLutShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BrdfLutShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BrdfLutShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
  }
}
