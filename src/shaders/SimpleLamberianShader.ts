import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4, vec3 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/lamberian.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/completeMVP.vert').default;

export interface IGLSimpleLamberianShader extends IGLShaderState {
  mvpMat: mat4;
  normalMat: mat4;
  modelMat: mat4;
  cameraPos: vec3;

  textureInd: number;
}

export class SimpleLamberianShaderState extends GLShaderState implements IGLSimpleLamberianShader {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);
    gl.uniform3fv(uniformsLocations.u_cameraPos, this.cameraPos);

    gl.uniform1i(uniformsLocations.u_tex, this.textureInd);
    gl.uniform1i(uniformsLocations.u_cmap, 9);
    gl.uniform3fv(uniformsLocations.u_lightDirection, this.lightDirection);
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);
  }

  lightDirection: vec3 = vec3.fromValues(0, -1, 0);
  lightColor: vec3 = vec3.fromValues(0.9, 0.9, 0.9);
  ambiantColor: vec3 = vec3.fromValues(0.3, 0.3, 0.3);

  modelMat: mat4;
  cameraPos: vec3;

  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  textureInd = 0;
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
  }
}
