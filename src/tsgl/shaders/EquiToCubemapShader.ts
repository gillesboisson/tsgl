import { mat4, vec4 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/equiToCubeMap.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/equiToCubeMap.vert').default;


export class EquiToCubemapShaderState extends GLShaderState{
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    
  }

  mvp: mat4 = mat4.create();
  // color: vec4 = vec4.create();
}

export const EquiToCubemapShaderID = 'equi_to_cubemap';

export class EquiToCubemapShader extends GLShader<EquiToCubemapShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      EquiToCubemapShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new EquiToCubemapShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, EquiToCubemapShaderState,getDefaultAttributeLocation(['a_position']));
    setDefaultTextureLocation(this,['u_texture'])
  }
}
