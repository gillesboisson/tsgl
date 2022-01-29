import { mat4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class VertexColorShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvp, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}
