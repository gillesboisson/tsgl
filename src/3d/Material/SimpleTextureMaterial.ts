import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { GLTexture } from '../../gl/core/GLTexture';
import { SimpleFlatShaderState } from '../../shaders/SimpleFlatShader';
import { Camera } from '../Camera';
import { AMaterial } from './Material';

export class SimpleTextureMaterial extends AMaterial<SimpleFlatShaderState> {
  constructor(renderer: GLRenderer, public texture: GLTexture) {
    super();

    this._shaderState = renderer.getShader('simple_flat').createState() as SimpleFlatShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    this.texture.active();
    cam.mvp(ss.mvp, transformMat);
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    this.texture.unbind();
  }
}
