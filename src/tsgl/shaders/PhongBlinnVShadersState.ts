import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { ShaderVariantsState } from '../gl/core/shader/variants/ShaderVariantsState';
import { PhongBlinnVariant } from './PhongBlinnVShader';

export class PhongBlinnVShadersState extends ShaderVariantsState<PhongBlinnVariant> {
  modelMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  depthBiasMvpMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();

  lightDirection: vec3 = vec3.create();
  lightColor: vec3 = vec3.create();
  specularColor: vec3 = vec3.create();
  lightShininess: number;

  ambiantColor: vec3 = vec3.create();
  diffuseColor: vec4 = vec4.create();

  shadowMapPixelSize: vec2 = vec2.create();

  syncUniforms(): void {
    const uniformsLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);
    gl.uniformMatrix4fv(uniformsLocations.u_depthBiasMvpMat, false, this.depthBiasMvpMat);

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);

    // TODO : investigate why light dir has to be inverted
    gl.uniform3f(
      uniformsLocations.u_lightDirection,
      -this.lightDirection[0],
      -this.lightDirection[1],
      -this.lightDirection[2],
    );
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_specularColor, this.specularColor);

    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);
    gl.uniform4fv(uniformsLocations.u_diffuseColor, this.diffuseColor);
    gl.uniform2fv(uniformsLocations.u_shadowMapPixelSize, this.shadowMapPixelSize);

    gl.uniform1f(uniformsLocations.u_lightShininess, this.lightShininess);
  }
}
