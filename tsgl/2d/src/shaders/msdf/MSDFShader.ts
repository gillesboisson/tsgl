import { mat4 } from 'gl-matrix';
import { IGLShaderState, GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { MSDFShaderState } from './MSDFShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/msdf.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/msdf.vert').default;

export const MSDFShaderID = 'msdf';

export class MSDFShader extends GLShader<MSDFShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      MSDFShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new MSDFShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    const ext = gl.getExtension('OES_standard_derivatives');
    if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, MSDFShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
