import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  setDefaultTextureLocation,
} from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';
// import { SHADER_KERNEL_BUFFER_SIZE, SSRShaderSettings } from '../SSRPass';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/ssr.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/ssr.vert').default;

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

export const SSRShaderID = 'ssr';

export class SSRShader extends GLShader<SSRShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SSRShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SSRShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SSRShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));

    setDefaultTextureLocation(this, ['u_normalMap', 'u_positionMap', 'u_depthMap', 'u_texture']);
  }
}
