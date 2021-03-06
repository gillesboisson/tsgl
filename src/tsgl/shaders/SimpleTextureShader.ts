import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/flatTexture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/simpleMVP.vert').default;


export class SimpleTextureShaderState extends GLShaderState{
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
  }

  mvp: mat4 = mat4.create();
  textureInd = 0;
}

export const SimpleTextureShaderID = 'simple_texture';

export class SimpleTextureShader extends GLShader<SimpleTextureShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      SimpleTextureShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new SimpleTextureShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, SimpleTextureShaderState,getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this,['u_texture']);
  }
}
