import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/skybox.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/skybox.vert').default;



export class SkyboxShaderState extends GLShaderState {
  syncUniforms(): void {
    this.gl.uniformMatrix4fv(this._uniformsLocations.u_mvpMap, false, this.mvpMat);
  }
  
  mvpMat: mat4 = mat4.create();
}

export const SkyboxShaderID = 'skybox';

export class SkyboxShader extends GLShader<SkyboxShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SkyboxShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SkyboxShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(
      gl,
      vertSrc,
      fragSrc,
      SkyboxShaderState,
      getDefaultAttributeLocation(['a_position', 'a_normal']),
    );

    setDefaultTextureLocation(this,['u_skyboxMap']);

  }
}
