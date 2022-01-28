import { mat4 } from 'gl-matrix';
import { Camera } from '../../tsgl/common';
import { AMaterial } from '../../tsgl/3d';
import { TranslateRotateTransform3D } from '../../tsgl/common';
import {
  GLDefaultTextureLocation,
} from '../../tsgl/gl';
import { AnyWebRenderingGLContext } from '../../tsgl/gl';
import { IGLTexture } from '../../tsgl/gl';
import { CartoonPassShaderState } from '../shaders/CartoonPassShader';

export class CartoonPassMaterial extends AMaterial<CartoonPassShaderState> {
  constructor(
    readonly colorTexture: IGLTexture,
    readonly normalTexture: IGLTexture,
    readonly lightDiffuseTexture: IGLTexture,
    readonly lightSpecTexture: IGLTexture,
    readonly depthTexture: IGLTexture,
  ) {
    super();
  }

  prepare(gl: AnyWebRenderingGLContext, cam: Camera<TranslateRotateTransform3D>, transformMat: mat4): void {
    // throw new Error('Method not implemented.');

    this.colorTexture.active(GLDefaultTextureLocation.COLOR);
    this.lightDiffuseTexture.active(GLDefaultTextureLocation.LIGHT_DIFFUSE);
    this.lightSpecTexture.active(GLDefaultTextureLocation.LIGHT_SPEC);
    this.normalTexture.active(GLDefaultTextureLocation.NORMAL);
  }

  unbind(gl: AnyWebRenderingGLContext): void {
    // throw new Error('Method not implemented.');

    this.colorTexture.unbind();
    this.lightDiffuseTexture.unbind();
    this.lightSpecTexture.unbind();
    this.normalTexture.unbind();
  }
}
