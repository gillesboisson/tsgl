import { mat4 } from 'gl-matrix';
import { GLDefaultTextureLocation } from '../../gl';
import { AnyWebRenderingGLContext } from '../../gl';
import { GLRenderer } from '../../gl';
import { IGLTexture } from '../../gl';
import { Camera } from '../../common';
import { AMaterial } from './Material';
import { SimpleLamberianShaderState } from '../shaders';

export class SimpleLamberianMaterial extends AMaterial<SimpleLamberianShaderState> {
  constructor(
    renderer: GLRenderer,
    public diffuseMap: IGLTexture,
    public normalMap: IGLTexture,
    public pbrMap: IGLTexture,
  ) {
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
