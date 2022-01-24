import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { mat4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/basic_texture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/basic_texture.vert').default;

export class BasicTextureShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}

export const BasicTextureShaderID = 'basic_texture';

export class BasicTextureShader extends GLShader<BasicTextureShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BasicTextureShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BasicTextureShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BasicTextureShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
