import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { getDefaultAttributeLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLSupport } from '../gl/core/GLSupport';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/depth_only.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/depth_only.vert').default;

export interface DepthOnlyShaderState extends IGLShaderState {
  mvpMat: mat4;
}

export class DepthOnlyShaderState extends GLShaderState implements DepthOnlyShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvpMat);
  }

  mvpMat: mat4 = mat4.create();
}

export const DepthOnlyShaderID = 'depth_only';

export class DepthOnlyShader extends GLShader<DepthOnlyShaderState> {
  static register(renderer: GLRenderer): void {
    GLSupport.depthTextureSupported(renderer.gl, true, true);

    renderer.registerShaderFactoryFunction(
      DepthOnlyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new DepthOnlyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    // const ext = gl.getExtension('OES_standard_derivatives');
    // if (!ext) throw new Error('MSDF Shader needs OES_standard_derivatives webgl extension to be supported');
    super(gl, vertSrc, fragSrc, DepthOnlyShaderState, getDefaultAttributeLocation(['a_position']));
  }
}
