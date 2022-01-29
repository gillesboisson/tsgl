import { GLShader, GLRenderer, GLSupport, AnyWebRenderingGLContext, getDefaultAttributeLocation } from '@tsgl/gl';
import { DepthOnlyShaderState } from './DepthOnlyShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./depthOnly.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./depthOnly.vert').default;

export const DepthOnlyShaderID = 'depth_only';

export class DepthOnlyShader extends GLShader<DepthOnlyShaderState> {
  static register(renderer: GLRenderer): void {
    GLSupport.depthTextureSupported(renderer.gl, true, true);

    renderer.registerShaderFactoryFunction(
      DepthOnlyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new DepthOnlyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    // const ext = gl.getExtension('OES_standard_derivatives');
    // if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, DepthOnlyShaderState, getDefaultAttributeLocation(['a_position']));
  }
}
