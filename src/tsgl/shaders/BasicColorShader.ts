import { GLShader } from '../gl/core/shader/GLShader';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { mat4, vec4 } from 'gl-matrix';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { GLRenderer } from '../gl/core/GLRenderer';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/basicColor.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/basicColor.vert').default;


export class BasicColorShaderState extends GLShaderState{
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform4fv(uniformsLocations.u_color, this.color);

  }

  mvp: mat4 = mat4.create();
  color: vec4 = vec4.create();
}

export const BasicColorShaderID = 'basic_color';

export class BasicColorShader extends GLShader<BasicColorShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      BasicColorShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new BasicColorShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, BasicColorShaderState,getDefaultAttributeLocation(['a_position']));
  }
}
