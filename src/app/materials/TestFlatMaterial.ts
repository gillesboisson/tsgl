import { mat4 } from 'gl-matrix';
import { Camera } from '../../3d/Camera';
import { AMaterial } from '../../3d/Material/Material';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLTexture } from '../../gl/core/GLTexture';
import { TestFlatShaderState, TestFlatID } from '../shaders/TestFlatShader';

export class TestFlatMaterial extends AMaterial<TestFlatShaderState> {
  constructor(renderer: GLRenderer, public texture: GLTexture) {
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
