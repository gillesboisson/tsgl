import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

const fragSrc = require('./glsl/simple_sprite.frag').default;
const vertSrc = require('./glsl/simple_sprite.vert').default;

export interface IGLSimpleSpriteShaderState extends IGLShaderState {
  mvp: mat4;
  textureInd: number;
}

export class SimpleSpriteShaderState extends GLShaderState implements IGLSimpleSpriteShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();
  textureInd: number = 0;
}

export class SimpleSpriteShader extends GLShader<SimpleSpriteShaderState> {
  static register(renderer: GLRenderer) {
    renderer.registerShaderFactoryFunction(
      'simple_sprite',
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleSpriteShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleSpriteShaderState, getDefaultAttributeLocation(['position', 'uv']));
  }
}
