import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';

const fragSrc = require('./glsl/sprite.frag').default;
const vertSrc = require('./glsl/sprite.vert').default;

export class SpriteShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();

  textureInd: number = 0;
}

export class SpriteShader extends GLShader<SpriteShaderState> {
  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SpriteShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
