import { mat4, vec3, vec2 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class ShadowOnlyShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_depthBiasMvpMat, false, this.depthBiasMvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniform3fv(uniformsLocations.u_lightDirection, this.lightDirection);
    gl.uniform2fv(uniformsLocations.u_pixelSize, this.pixelSize);
  }

  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  depthBiasMvpMat: mat4 = mat4.create();
  lightDirection: vec3 = vec3.create();
  pixelSize: vec2 = vec2.create();
}
