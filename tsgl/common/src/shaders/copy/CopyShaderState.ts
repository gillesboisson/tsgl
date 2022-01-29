import { mat4 } from 'gl-matrix';
import { GLShaderState, IGLShaderState } from '@tsgl/gl';



export class CopyShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_textureLod, this.textureLod);
  }

  mvp: mat4 = mat4.create();
  textureLod = 0;
}
