import { mat4 } from 'gl-matrix';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLShader } from '../gl/core/shader/GLShader';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/brdfLut.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/brdfLut.vert').default;

export class BrdfLutShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_textureLod, this.textureLod);
  }

  mvp: mat4 = mat4.create();
  textureLod = 0;
}

export const BrdfLutShaderID = 'brdf_lut';

export class BrdfLutShader extends GLShader<BrdfLutShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BrdfLutShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BrdfLutShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BrdfLutShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
  }
}
