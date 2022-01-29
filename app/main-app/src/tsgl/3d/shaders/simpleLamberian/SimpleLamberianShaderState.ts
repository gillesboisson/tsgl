import { mat4, vec3 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';
import { IGLSimpleLamberianShader } from './SimpleLamberianShader';


export class SimpleLamberianShaderState extends GLShaderState implements IGLSimpleLamberianShader {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);
    gl.uniform3fv(uniformsLocations.u_cameraPos, this.cameraPos);

    gl.uniform1i(uniformsLocations.u_tex, this.textureInd);
    gl.uniform1i(uniformsLocations.u_cmap, 9);
    gl.uniform3fv(uniformsLocations.u_lightDirection, this.lightDirection);
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);
  }

  lightDirection: vec3 = vec3.fromValues(0, -1, 0);
  lightColor: vec3 = vec3.fromValues(0.9, 0.9, 0.9);
  ambiantColor: vec3 = vec3.fromValues(0.3, 0.3, 0.3);

  modelMat: mat4;
  cameraPos: vec3;

  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  textureInd = 0;
}
