import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLShader } from '../gl/core/shader/GLShader';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLUbo } from '../gl/core/data/GLUbo';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { WasmSceneNodeResult } from '../WasmSceneNodeResult';
import { getUniformsLocation } from '../gl/core/shader/getUniformsLocation';

// const vertSrc = require('./glsl/basic.vert').default;
// const fragSrc = require('./glsl/basic.frag').default;

const vertSrc = require('./glsl/basic.gl2.vert').default;
const fragSrc = require('./glsl/basic.gl2.frag').default;

export class BasicShaderState extends GLShaderState {
  mvp = mat4.create();
  _ubo: GLUbo;
  _transformBuffer: GLBuffer;

  constructor(shader: GLShader<BasicShaderState>) {
    super(shader);
  }

  protected getUniformsLocation(program: WebGLProgram) {
    this._uniformsLocation = getUniformsLocation(this.gl, program, []);
  }

  syncUniforms(): void {
    this.gl.uniformMatrix4fv(this._uniformsLocation.mvp, false, this.mvp);
  }
}

export class BasicShader extends GLShader<BasicShaderState> {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertSrc, fragSrc, BasicShaderState, getDefaultAttributeLocation(['position', 'color']));
  }
}
