import { mat4, vec4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';



export class BasicColorShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform4fv(uniformsLocations.u_color, this.color);
  }

  mvp: mat4 = mat4.create();
  color: vec4 = vec4.create();
}
