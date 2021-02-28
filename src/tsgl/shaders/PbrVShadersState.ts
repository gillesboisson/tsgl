import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { ShaderVariantsState } from '../gl/core/shader/variants/ShaderVariantsState';
import { PbrVariant } from './PbrVShader';

export class PbrVShadersState extends ShaderVariantsState<PbrVariant> {
  modelMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  depthBiasMvpMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();
  lightDirection: vec3 = vec3.create();

  ambiantColor: vec3 = vec3.create();
  diffuseColor: vec4 = vec4.create();

  shadowMapPixelSize: vec2 = vec2.create();

  gammaExposure = vec2.create();

  protected _pbr: vec4 = vec4.create();

  get roughness(): number {
    return this._pbr[0];
  }

  set roughness(val: number) {
    if (val !== this._pbr[0]) {
      this._pbr[0] = val;
    }
  }

  get metallic(): number {
    return this._pbr[1];
  }

  set metallic(val: number) {
    if (val !== this._pbr[1]) {
      this._pbr[1] = val;
    }
  }

  get ao(): number {
    return this._pbr[2];
  }

  set ao(val: number) {
    if (val !== this._pbr[2]) {
      this._pbr[2] = val;
    }
  }

  setPbr(ambiantOcclusion: number, roughness: number, metallic: number, extra = 0): void {
    vec4.set(this._pbr,ambiantOcclusion,roughness, metallic, extra);
  }

  syncUniforms(): void {
    const uniformsLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);
    gl.uniformMatrix4fv(uniformsLocations.u_depthBiasMvpMat, false, this.depthBiasMvpMat);

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);
    gl.uniform2fv(uniformsLocations.u_gammaExposure, this.gammaExposure);

    // TODO : investigate why light dir has to be inverted
    gl.uniform3f(
      uniformsLocations.u_lightDirection,
      -this.lightDirection[0],
      -this.lightDirection[1],
      -this.lightDirection[2],
    );

    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);
    gl.uniform4fv(uniformsLocations.u_diffuseColor, this.diffuseColor);
    gl.uniform2fv(uniformsLocations.u_shadowMapPixelSize, this.shadowMapPixelSize);
    gl.uniform4fv(uniformsLocations.u_pbr, this._pbr);
  }
}
