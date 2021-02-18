import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/msdf.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/msdf.vert').default;

export interface IGLMSDFShaderState extends IGLShaderState {
  mvp: mat4;
  textureInd: number;
}

export class MSDFShaderState extends GLShaderState implements IGLMSDFShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.mvp, false, this.mvp);
    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}

export const MSDFShaderID = 'msdf';

export class MSDFShader extends GLShader<MSDFShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      MSDFShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new MSDFShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    const ext = gl.getExtension('OES_standard_derivatives');
    if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, MSDFShaderState, getDefaultAttributeLocation(['position', 'uv', 'color']));
  }
}
