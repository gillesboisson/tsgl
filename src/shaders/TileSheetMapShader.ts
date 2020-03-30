import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

const fragSrc = require('./glsl/copyTile.frag').default;
const vertSrc = require('./glsl/copyTile.vert').default;

export interface IGLTileSheetMapShaderState extends IGLShaderState {
  textureInd: number;
}

export class TileSheetMapShaderState extends GLShaderState implements IGLTileSheetMapShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocation;

    gl.uniform1i(uniformsLocations.texture, this.textureInd);
  }

  textureInd: number = 0;
}

export class TileSheetMapShader extends GLShader<TileSheetMapShaderState> {
  static register(renderer: GLRenderer) {
    renderer.registerShaderFactoryFunction(
      'copyTile',
      (gl: AnyWebRenderingGLContext, name: string) => new TileSheetMapShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TileSheetMapShaderState, getDefaultAttributeLocation(['position', 'uv']));
  }
}
