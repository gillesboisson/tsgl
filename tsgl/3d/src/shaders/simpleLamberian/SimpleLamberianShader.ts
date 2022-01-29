import { mat4, vec3 } from 'gl-matrix';
import { IGLShaderState, GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { SimpleLamberianShaderState } from './SimpleLamberianShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/lamberian.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/completeMVP.vert').default;

export interface IGLSimpleLamberianShader extends IGLShaderState {
  mvpMat: mat4;
  normalMat: mat4;
  modelMat: mat4;
  cameraPos: vec3;

  textureInd: number;
}

export class SimpleLamberianShader extends GLShader<SimpleLamberianShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'simple_lamberian',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleLamberianShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(
      gl,
      vertSrc,
      fragSrc,
      SimpleLamberianShaderState,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv']),
    );

    setDefaultTextureLocation(this, ['u_diffuseMap', 'u_normalMap', 'u_pbrMap']);
  }
}
