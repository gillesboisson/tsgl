import { mat4 } from 'gl-matrix';
import { Camera } from '../../tsgl/3d/Camera';
import { AMaterial } from '../../tsgl/3d/Material/Material';
import { TranslateRotateTransform3D } from '../../tsgl/geom/TranslateRotateTransform3D';
import {
  GLDefaultAttributesLocation,
  GLDefaultTextureLocation,
} from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLTexture2D, IGLTexture } from '../../tsgl/gl/core/texture/GLTexture';
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
