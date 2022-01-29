import { GLShader, GLRenderer, GLSupport, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { ShadowOnlyShaderState } from './ShadowOnlyShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./shadow_only.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./shadow_only.vert').default;

export const ShadowOnlyShaderID = 'shadow_only';

export class ShadowOnlyShader extends GLShader<ShadowOnlyShaderState> {
  static register(renderer: GLRenderer): void {
    GLSupport.depthTextureSupported(renderer.gl, true, true);

    renderer.registerShaderFactoryFunction(
      ShadowOnlyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new ShadowOnlyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    // const ext = gl.getExtension('OES_standard_derivatives');
    // if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, ShadowOnlyShaderState, getDefaultAttributeLocation(['a_position', 'a_normal']));
    setDefaultTextureLocation(this, ['u_shadowMap']);
    // gl.useProgram(this._program);
    // const uniformLocation = this._uniformsLocations['u_poissonDisk[0]'];
    // gl.uniform2fv(
    //   this._uniformsLocations['u_poissonDisk[0]'],
    //   new Float32Array([
    //     -0.94201624,
    //     -0.39906216,
    //     0.94558609,
    //     -0.76890725,
    //     -0.094184101,
    //     -0.9293887,
    //     0.34495938,
    //     0.2938776,
    //   ]),
    // );
  }
}
