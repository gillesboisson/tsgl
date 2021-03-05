import { mat4 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/GLTexture';
import { SimpleLamberianShaderState } from '../../shaders/SimpleLamberianShader';
import { Camera } from '../Camera';
import { AMaterial } from './Material';

export class SimpleLamberianMaterial extends AMaterial<SimpleLamberianShaderState> {
  constructor(renderer: GLRenderer, public diffuseMap: IGLTexture, public normalMap: IGLTexture, public pbrMap: IGLTexture) {
    super();

    this._shaderState = renderer.getShader('simple_lamberian').createState() as SimpleLamberianShaderState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepare(gl: AnyWebRenderingGLContext, cam: Camera, transformMat: mat4): void {
    const ss = this._shaderState;
    ss.use();
    this.diffuseMap.active(GLDefaultTextureLocation.COLOR);
    this.normalMap.active(GLDefaultTextureLocation.NORMAL);
    this.pbrMap.active(GLDefaultTextureLocation.PBR_0);
    
    cam.mvp(ss.mvpMat, transformMat);
    cam.normalMat(ss.normalMat, transformMat);
    ss.modelMat = transformMat;
    ss.cameraPos = cam.transform.getRawPosition();

    ss.syncUniforms();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unbind(gl: AnyWebRenderingGLContext): void {
    this.diffuseMap.unbind();
  }
}
