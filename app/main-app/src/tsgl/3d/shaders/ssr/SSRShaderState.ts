import { mat4, vec2 } from 'gl-matrix';
import { GLShaderState } from '../../../../tsgl/gl';


export class SSRShaderState extends GLShaderState {
  pMat = mat4.create();
  texSize = vec2.create();

  syncUniforms(): void {
    const gl = this.gl as WebGL2RenderingContext;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_pMat, false, this.pMat);
    gl.uniform2fv(uniformsLocations.u_texSize, this.texSize);
  }
}
