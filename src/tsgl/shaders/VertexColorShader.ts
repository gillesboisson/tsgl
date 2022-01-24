import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/vertex_color.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/vertex_color.vert').default;

export class VertexColorShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvp, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}

export class VertexColorShader extends GLShader<VertexColorShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      'vertex_color',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new VertexColorShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, VertexColorShaderState, getDefaultAttributeLocation(['a_position', 'a_color']));
  }
}
