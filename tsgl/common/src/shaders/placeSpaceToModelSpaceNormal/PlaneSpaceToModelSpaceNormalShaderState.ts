import { mat4 } from 'gl-matrix';
import { GLShaderState } from '@tsgl/gl';


export class PlaneSpaceToModelSpaceNormalShaderState extends GLShaderState {
  syncUniforms(): void {
    this.gl.uniformMatrix4fv(this._uniformsLocations.u_mvpMap, false, this.mvpMat);
  }

  mvpMat: mat4 = mat4.create();
}
