import { mat4 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/GLTexture';
import { SkyboxShaderID, SkyboxShaderState } from '../../shaders/SkyboxShader';
import { Camera } from '../Camera';
import { AMaterial } from './Material';

export class SkyboxMaterial extends AMaterial<SkyboxShaderState> {

  /**
   * 
   * @param renderer renderer 
   * @param texture Cubemap texture
   */
  constructor(renderer: GLRenderer, public texture: IGLTexture) {
    super();
    
    this._shaderState = renderer.getShader(SkyboxShaderID).createState() as SkyboxShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    this.texture.active(GLDefaultTextureLocation.SKYBOX);
    cam.mvp(ss.mvpMat, transformMat);
    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    this.texture.unbind();
  }
}
