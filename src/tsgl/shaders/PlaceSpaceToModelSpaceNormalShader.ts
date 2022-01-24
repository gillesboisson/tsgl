import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/plane_space_to_model_space_normal.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/plane_space_to_model_space_normal.vert').default;

export class PlaneSpaceToModelSpaceNormalShaderState extends GLShaderState {
  syncUniforms(): void {
    this.gl.uniformMatrix4fv(this._uniformsLocations.u_mvpMap, false, this.mvpMat);
  }

  mvpMat: mat4 = mat4.create();
}

export const PlaneSpaceToModelSpaceNormalShaderID = 'plane_space_to_model_space_normal';

export class PlaneSpaceToModelSpaceNormalShader extends GLShader<PlaneSpaceToModelSpaceNormalShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PlaneSpaceToModelSpaceNormalShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PlaneSpaceToModelSpaceNormalShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(
      gl,
      vertSrc,
      fragSrc,
      PlaneSpaceToModelSpaceNormalShaderState,
      getDefaultAttributeLocation(['a_tangent', 'a_normal', 'a_uv']),
    );

    setDefaultTextureLocation(this, ['u_normalMap']);
  }
}
