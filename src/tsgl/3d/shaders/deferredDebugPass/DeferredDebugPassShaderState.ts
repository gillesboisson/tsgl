import { vec2 } from 'gl-matrix';
import { GLShaderState, IGLShaderState } from '../../../../tsgl/gl';


export class DeferredDebugPassShaderState extends GLShaderState implements IGLShaderState {
  readonly pixelSize = vec2.create();

  resize(width: number, height: number): void {
    this.pixelSize[0] = 1 / width;
    this.pixelSize[1] = 1 / height;
  }

  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform2fv(uniformsLocations.u_pixelSize, this.pixelSize);

  }
}
