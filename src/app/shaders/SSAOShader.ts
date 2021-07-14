import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  setDefaultTextureLocation,
} from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';
import { SHADER_KERNEL_BUFFER_SIZE, SSAOShaderOptions } from '../SSAOPass';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/ssao.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/ssao.vert').default;

export class SSAOShaderState extends GLShaderState {
  pMat = mat4.create();
  vMat = mat4.create();
  settings = vec4.create();
  noiseScale = vec2.create();

  syncUniforms(): void {
    const gl = this.gl as WebGL2RenderingContext;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_pMat, false, this.pMat);
    gl.uniformMatrix4fv(uniformsLocations.u_vMat, false, this.vMat);
    gl.uniform2fv(uniformsLocations.u_noiseScale, this.noiseScale);
  }

  updateKernel(kernelSamples: Float32Array, kernelSize: number, use = true): void {
    if (use) this.use();
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    const loc = gl.getUniformLocation(this._program, 'u_ssaoSamples');

    (gl as any).uniform3fv(loc, kernelSamples, 0, SHADER_KERNEL_BUFFER_SIZE * 3);

    gl.uniform1i(uniformsLocations.u_kernelSize, kernelSize);
  }

  updateSettings(settings: SSAOShaderOptions, use = true) {
    if (use) this.use();
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;
    gl.uniform4f(uniformsLocations.u_settings, settings.radius, settings.power, settings.bias, 0);
  }
}

export const SSAOShaderID = 'ssao';

export class SSAOShader extends GLShader<SSAOShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SSAOShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SSAOShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SSAOShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));

    setDefaultTextureLocation(this, ['u_normalMap', 'u_positionMap', 'u_depthMap', 'u_ssaoRotationMap']);
  }
}
