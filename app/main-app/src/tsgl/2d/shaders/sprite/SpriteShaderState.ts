import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../../../gl';


export class SpriteShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.u_texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}
