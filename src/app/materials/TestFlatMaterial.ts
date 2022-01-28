import { mat4 } from 'gl-matrix';
import { AMaterial } from '../../tsgl/3d';
import { AnyWebRenderingGLContext } from '../../tsgl/gl';
import { GLRenderer } from '../../tsgl/gl';
import { IGLTexture } from '../../tsgl/gl';
import { Camera } from '../../tsgl/common';
import { TestFlatShaderState, TestFlatID } from '../shaders/TestFlatShader';

export class TestFlatMaterial extends AMaterial<TestFlatShaderState> {
  constructor(renderer: GLRenderer, public texture: IGLTexture) {
    super();

    this._shaderState = renderer.getShader(TestFlatID).createState() as TestFlatShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    this.texture.unbind();
  }
}
