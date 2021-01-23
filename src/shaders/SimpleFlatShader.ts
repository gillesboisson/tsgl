import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/flatTexture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/simpleMVP.vert').default;

export interface IGLSimpleFlatShader extends IGLShaderState {
  mvp: mat4;
  textureInd: number;
}

export class SimpleFlatShaderState extends GLShaderState implements IGLSimpleFlatShader {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}

export class SimpleFlatShader extends GLShader<SimpleFlatShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'simple_flat',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleFlatShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleFlatShaderState, getDefaultAttributeLocation(['position', 'uv']));
  }
}
