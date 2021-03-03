import { mat4, vec2 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLShader } from '../gl/core/shader/GLShader';
import { GLShaderState } from '../gl/core/shader/GLShaderState';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/quad.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/quad.vert').default;

export class QuadCopyShaderState extends GLShaderState implements IGLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform2fv(uniformsLocations.u_gammaExposure, this.gammaExposure);
    


  }

  gammaExposure = vec2.fromValues(2.2,0.5);
  textureLod = 0;
}

export const QuadCopyShaderID = 'quad_copy';

export class QuadCopyShader extends GLShader<QuadCopyShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      QuadCopyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new QuadCopyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, QuadCopyShaderState,getDefaultAttributeLocation(['a_position','a_uv']));
    setDefaultTextureLocation(this,['u_texture']);
    
  }
}
