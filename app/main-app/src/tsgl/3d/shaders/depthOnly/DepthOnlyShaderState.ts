import { mat4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class DepthOnlyShaderState extends GLShaderState{
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
  }

  mvpMat: mat4 = mat4.create();
}
