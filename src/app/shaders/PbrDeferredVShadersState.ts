import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { ShaderVariantsState } from '../../tsgl/gl/core/shader/variants/ShaderVariantsState';
import { PbrDeferredVariant } from './PbrDeferredVShader';

export class PbrDeferredVShadersState extends ShaderVariantsState<PbrDeferredVariant> {
  depthBiasMvpMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();

  lightDirection: vec3 = vec3.create();

  ambiantColor: vec3 = vec3.create();
  diffuseColor: vec4 = vec4.create();

  shadowMapPixelSize: vec2 = vec2.create();

  gammaExposure = vec2.create();


  viewInvertedRotationMat = mat4.create();


  syncUniforms(): void {
    const uniformsLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniformMatrix4fv(uniformsLocations.u_depthBiasMvpMat, false, this.depthBiasMvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_viewInvertedRotationMat, false, this.viewInvertedRotationMat);

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);
    // TODO : investigate why light dir has to be inverted
    gl.uniform3f(uniformsLocations.u_lightDirection, -this.lightDirection[0], -this.lightDirection[1], -this.lightDirection[2]);

    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);
    gl.uniform4fv(uniformsLocations.u_diffuseColor, this.diffuseColor);
    gl.uniform2fv(uniformsLocations.u_shadowMapPixelSize, this.shadowMapPixelSize);

    gl.uniform2fv(uniformsLocations.u_gammaExposure, this.gammaExposure);


  }
}
