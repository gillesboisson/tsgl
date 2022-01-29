import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../gl';
import { PlaneSpaceToModelSpaceNormalShaderState } from './PlaneSpaceToModelSpaceNormalShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./plane_space_to_model_space_normal.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./plane_space_to_model_space_normal.vert').default;

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
