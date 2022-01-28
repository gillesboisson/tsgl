import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { SimpleTextureShaderID, SimpleTextureShaderState } from '../../shaders/SimpleTextureShader';
import { Camera } from '../../utils';
import { AMaterial } from './Material';

export class SimpleTextureMaterial extends AMaterial<SimpleTextureShaderState> {
  constructor(renderer: GLRenderer, public texture: IGLTexture) {
    super();

    this._shaderState = renderer.getShader(SimpleTextureShaderID).createState() as SimpleTextureShaderState;
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
