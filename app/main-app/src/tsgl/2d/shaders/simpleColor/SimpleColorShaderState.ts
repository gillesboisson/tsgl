import { vec4 } from 'gl-matrix';
import { GLShaderState } from '../../../gl';


export class SimpleColorShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform1i(uniformsLocations.textureInd, this.textureInd);
    gl.uniform4fv(uniformsLocations.color, this.color);
  }
  // @glShaderUniformProp('i',1,'tex')
  textureInd = 0;

  color: vec4 = vec4.fromValues(1, 0, 1, 1);
}
