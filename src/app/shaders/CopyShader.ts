import { mat4 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';
import { IGLShaderState } from '../../tsgl/gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/copy.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/copy.vert').default;

export class CopyShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_textureLod, this.textureLod);
  }

  mvp: mat4 = mat4.create();
  textureLod = 0;
}

export const CopyShaderID = 'copy';

export class CopyShader extends GLShader<CopyShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      CopyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new CopyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, CopyShaderState,getDefaultAttributeLocation(['a_position','a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
