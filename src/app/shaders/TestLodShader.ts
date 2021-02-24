import { mat4, vec4 } from 'gl-matrix';
import { getDefaultAttributeLocation, setDefaultTextureLocation } from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/testLodTexture.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/testLodTexture.vert').default;


export class TestLodShaderState extends GLShaderState{
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    
  }

  mvp: mat4 = mat4.create();
  // color: vec4 = vec4.create();
}

export const TestLodShaderID = 'lod_test';

export class TestLodShader extends GLShader<TestLodShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      TestLodShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new TestLodShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, TestLodShaderState,getDefaultAttributeLocation(['a_position','a_uv']));
    setDefaultTextureLocation(this,['u_texture'])
  }
}
