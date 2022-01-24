import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { mat4, vec3 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/pbrSimple.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/pbrSimple.vert').default;

export class SimplePBRShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);

    gl.uniform3fv(uniformsLocations.u_albedo, this.albedo);

    gl.uniform1f(uniformsLocations.u_metallic, this.metallic);
    gl.uniform1f(uniformsLocations.u_roughness, this.roughness);
    gl.uniform1f(uniformsLocations.u_ao, this.ao);

    gl.uniform3f(
      uniformsLocations.u_lightDirection,
      -this.lightDirection[0],
      -this.lightDirection[1],
      -this.lightDirection[2],
    );
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);
  }

  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  modelMat: mat4 = mat4.create();

  albedo: vec3 = vec3.create();

  metallic: number;
  roughness: number;
  ao: number;

  lightDirection: vec3 = vec3.create();
  lightColor: vec3 = vec3.create();

  cameraPosition: vec3 = vec3.create();
}

export const SimplePBRShaderID = 'simple_pbr';

export class SimplePBRShader extends GLShader<SimplePBRShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SimplePBRShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimplePBRShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimplePBRShaderState, getDefaultAttributeLocation(['a_position', 'a_uv', 'a_normal']));

    setDefaultTextureLocation(this, ['u_irradianceMap', 'u_reflexionMap', 'u_brdfLut']);
  }
}
