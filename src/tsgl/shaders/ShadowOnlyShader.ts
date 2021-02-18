import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLSupport } from '../gl/core/GLSupport';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/shadow_only.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/shadow_only.vert').default;

export class ShadowOnlyShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_depthBiasMvpMat, false, this.depthBiasMvpMat);
    gl.uniformMatrix4fv(uniformsLocations.u_normalMat, false, this.normalMat);
    gl.uniform3fv(uniformsLocations.u_lightDirection, this.lightDirection);
    gl.uniform2fv(uniformsLocations.u_pixelSize, this.pixelSize);
    
  }

  mvpMat: mat4 = mat4.create();
  normalMat: mat4 = mat4.create();
  depthBiasMvpMat: mat4 = mat4.create();
  lightDirection: vec3 = vec3.create();
  pixelSize: vec2 = vec2.create();
}

export const ShadowOnlyShaderID = 'shadow_only';

export class ShadowOnlyShader extends GLShader<ShadowOnlyShaderState> {
  static register(renderer: GLRenderer): void {
    GLSupport.depthTextureSupported(renderer.gl, true, true);

    renderer.registerShaderFactoryFunction(
      ShadowOnlyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new ShadowOnlyShader(gl),
    );

    
  }

  constructor(gl: AnyWebRenderingGLContext) {
    // const ext = gl.getExtension('OES_standard_derivatives');
    // if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, ShadowOnlyShaderState, getDefaultAttributeLocation(['a_position', 'a_normal']));
    setDefaultTextureLocation(this, ['u_shadowMap']);
    // gl.useProgram(this._program);
    // const uniformLocation = this._uniformsLocations['u_poissonDisk[0]'];
    // gl.uniform2fv(
    //   this._uniformsLocations['u_poissonDisk[0]'],
    //   new Float32Array([
    //     -0.94201624,
    //     -0.39906216,
    //     0.94558609,
    //     -0.76890725,
    //     -0.094184101,
    //     -0.9293887,
    //     0.34495938,
    //     0.2938776,
    //   ]),
    // );
  }
}
