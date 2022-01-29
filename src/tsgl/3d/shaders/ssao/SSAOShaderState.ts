import { mat4, vec4, vec2 } from 'gl-matrix';
import { GLShaderState } from '../../../../tsgl/gl';
import { SHADER_KERNEL_BUFFER_SIZE, SSAOShaderOptions } from '../../postprocess/SSAOPass';


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
    if (use)
      this.use();
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    const loc = gl.getUniformLocation(this._program, 'u_ssaoSamples');

    (gl as any).uniform3fv(loc, kernelSamples, 0, SHADER_KERNEL_BUFFER_SIZE * 3);

    gl.uniform1i(uniformsLocations.u_kernelSize, kernelSize);
  }

  updateSettings(settings: SSAOShaderOptions, use = true) {
    if (use)
      this.use();
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;
    gl.uniform4f(uniformsLocations.u_settings, settings.radius, settings.power, settings.bias, 0);
  }
}
