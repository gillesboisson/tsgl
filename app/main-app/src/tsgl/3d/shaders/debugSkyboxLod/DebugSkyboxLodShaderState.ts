import { mat4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class DebugSkyboxLodShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_lod, this.lod);
  }

  mvp: mat4 = mat4.create();
  lod = 0;
}
