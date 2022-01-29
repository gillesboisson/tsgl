import { mat4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class ReflectanceShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_roughness, this.roughness);
  }

  mvp: mat4 = mat4.create();
  roughness: number;
}
