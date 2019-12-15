import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLShader } from '../gl/core/shader/GLShader';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';

const vertSrc = require('./glsl/basic.vert').default;
const fragSrc = require('./glsl/basic.frag').default;

export class BasicShaderState extends GLShaderState {
  mvp = mat4.create();

  syncUniforms(): void {
    this.gl.uniformMatrix4fv(this._uniformsLocation.mvp, false, this.mvp);
  }
}

export class BasicShader extends GLShader<BasicShaderState> {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertSrc, fragSrc, BasicShaderState, getDefaultAttributeLocation(['position', 'color']));
  }
}
