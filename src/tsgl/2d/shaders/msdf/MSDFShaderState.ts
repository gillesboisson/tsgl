import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../../../gl';


export class MSDFShaderState extends GLShaderState  {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}
