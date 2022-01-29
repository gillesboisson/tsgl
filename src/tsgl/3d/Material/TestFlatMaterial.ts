import { mat4 } from 'gl-matrix';
import { AMaterial } from '..';
import { AnyWebRenderingGLContext } from '../../gl';
import { GLRenderer } from '../../gl';
import { IGLTexture } from '../../gl';
import { Camera } from '../../common';
import { TestFlatID } from '../../../app/shaders/testFlat/TestFlatShader';
import { TestFlatShaderState } from "../../../app/shaders/testFlat/TestFlatShaderState";

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
