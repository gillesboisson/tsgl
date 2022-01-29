import { vec2 } from 'gl-matrix';
import { GLShaderState, IGLShaderState } from '../../../gl';


export class QuadCopyShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform2fv(uniformsLocations.u_gammaExposure, this.gammaExposure);
  }

  gammaExposure = vec2.fromValues(2.2, 0.5);
  textureLod = 0;
}
