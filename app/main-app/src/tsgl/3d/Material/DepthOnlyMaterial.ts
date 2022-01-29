import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '@tsgl/gl';
import { GLRenderer } from '@tsgl/gl';
import { DepthOnlyShaderID } from '../shaders/depthOnly/DepthOnlyShader';
import { Camera } from '@tsgl/common';
import { AMaterial } from './Material';
import { DepthOnlyShaderState } from '../shaders';

export class DepthOnlyMaterial extends AMaterial<DepthOnlyShaderState> {
  /**
   *
   * @param renderer renderer
   * @param texture Cubemap texture
   */
  constructor(renderer: GLRenderer) {
    super();

    this._shaderState = renderer.getShader(DepthOnlyShaderID).createState() as DepthOnlyShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    cam.mvp(ss.mvpMat, transformMat);
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {}
}
