import { mat4 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '../../gl';
import { GLRenderer } from '../../gl';
import { IGLTexture } from '../../gl';
import { SimpleTextureShaderID } from '../shaders/simpleTexture/SimpleTextureShader';
import { SimpleTextureShaderState } from "../shaders/simpleTexture/SimpleTextureShaderState";
import { Camera } from '../../common';
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
