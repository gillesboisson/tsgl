import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../../../gl';


export class IrradianceShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
}
