import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { ShaderVariantsState } from '../../tsgl/gl/core/shader/variants/ShaderVariantsState';
import { DeferredPrepassVariant } from './DeferredPrepassVShader';

export class DeferredPrepassVShadersState extends ShaderVariantsState<DeferredPrepassVariant> {
  modelMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  diffuseColor: vec4 = vec4.create();
  protected _pbr: vec4 = vec4.create();

  syncUniforms(): void {
    const uniformsLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);


    gl.uniform4fv(uniformsLocations.u_pbr, this._pbr);

    gl.uniform4fv(uniformsLocations.u_diffuseColor, this.diffuseColor);
  }


  setPbr(ambiantOcclusion: number, roughness: number, metallic: number, extra = 0): void {
    vec4.set(this._pbr,ambiantOcclusion,roughness, metallic, extra);
  }
}
