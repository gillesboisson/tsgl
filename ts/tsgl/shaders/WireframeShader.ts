import { GLShader } from '../../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../../gl/core/shader/GLShaderState';
import { GLRenderer } from '../../gl/core/GLRenderer';

const fragSrc = require('./glsl/wireframe.frag').default;
const vertSrc = require('./glsl/wireframe.vert').default;

export class WireframeShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
}

export class WireframeShader extends GLShader<WireframeShaderState> {
  static registerShader(renderer: GLRenderer) {
    renderer.registerShader('wireframe', new WireframeShader(renderer.getGL()));
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, WireframeShaderState, getDefaultAttributeLocation(['position', 'color']));
  }
}
