import { vec3, vec4, mat4 } from 'gl-matrix';
import { ShaderVariantsState } from '@tsgl/gl';
import { LambertVariant } from './LambertVShader';

export class LambertVShadersState extends ShaderVariantsState<LambertVariant> {
  // @shaderVariantProp()
  // extraColor: 'red' | 'green' | 'blue';
  // @shaderVariantProp()
  // shadeMode: 'vertex' | 'fragment';
  lightPos: vec3 = vec3.create();
  color: vec4 = vec4.create();
  mvMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();


  syncUniforms(): void {
    const uniformLocations = this._variantShader.uniformsLocation;
    const gl = this.gl;

    gl.uniform3fv(uniformLocations.u_lightPos, this.lightPos);
    gl.uniform4fv(uniformLocations.u_color, this.color);
    gl.uniformMatrix4fv(uniformLocations.u_mvMat, false, this.mvMat);
    gl.uniformMatrix4fv(uniformLocations.u_mvpMat, false, this.mvpMat);
  }
}
