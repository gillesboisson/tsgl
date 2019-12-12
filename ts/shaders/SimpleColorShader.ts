import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4, vec4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';

const fragSrc = require('./glsl/simpleColor.frag').default;
const vertSrc = require('./glsl/simpleColor.vert').default;

export class SimpleColorShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniform1i(uniformsLocations.textureInd, this.textureInd);
    gl.uniform4fv(uniformsLocations.color, this.color);
  }
  // @glShaderUniformProp('i',1,'tex')
  textureInd: number = 0;

  color: vec4 = vec4.fromValues(1, 0, 1, 1);
}

export class SimpleColorShader extends GLShader<SimpleColorShaderState> {
  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleColorShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
