import { vec2 } from 'gl-matrix';
import { GLShaderState } from '../../../gl';


export class SSAOBlurShaderState extends GLShaderState {
  texSize = vec2.create();

  syncUniforms(): void {
    const gl = this.gl as WebGL2RenderingContext;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform2fv(uniformsLocations.u_texSize, this.texSize);
  }


}
