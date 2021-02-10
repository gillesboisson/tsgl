import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4, vec3 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/phongBlinn.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/phongBlinn.vert').default;

export class PhongBlinnShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniformMatrix4fv(uniformsLocations.u_modelMat, false, this.modelMat);

    

    gl.uniform3fv(uniformsLocations.u_cameraPosition, this.cameraPosition);

    gl.uniform3fv(uniformsLocations.u_lightPosition, this.lightPosition);
    gl.uniform3fv(uniformsLocations.u_lightColor, this.lightColor);
    gl.uniform3fv(uniformsLocations.u_specularColor, this.specularColor);
    gl.uniform3fv(uniformsLocations.u_ambiantColor, this.ambiantColor);

    gl.uniform1f(uniformsLocations.u_lightShininess, this.lightShininess);
  }

  /*
  uniform mat4 u_mvpMat;
uniform mat4 u_normalMat;
uniform mat4 u_mvMat;

  uniform sampler2D u_textureMap
uniform vec3 u_cameraPosition
uniform vec3 u_lightPosition
uniform vec3 u_lightColor
uniform float u_lightShininess
uniform vec3 u_ambiantColor
*/

  modelMat: mat4 = mat4.create();
  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();

  cameraPosition: vec3 = vec3.create();
  
  lightPosition: vec3 = vec3.create();
  lightColor: vec3 = vec3.create();
  specularColor: vec3 = vec3.create();
  lightShininess: number;

  ambiantColor: vec3 = vec3.create();
}

export const PhongBlinnShaderID = 'phong_blinn';

export class PhongBlinnShader extends GLShader<PhongBlinnShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      PhongBlinnShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new PhongBlinnShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(
      gl,
      vertSrc,
      fragSrc,
      PhongBlinnShaderState,
      getDefaultAttributeLocation(['a_position', 'a_normal', 'a_uv']),
    );

    setDefaultTextureLocation(this,['u_diffuseMap','u_normalMap','u_pbrMap']);

  }
}
