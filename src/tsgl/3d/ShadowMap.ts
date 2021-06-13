import { mat4, vec3 } from 'gl-matrix';
import { CameraLookAtTransform3D } from '../geom/CameraTargetTransform3D';
import { ITransform } from '../gl/abstract/ITransform';
import { GLDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { GLFramebuffer } from '../gl/core/framebuffer/GLFramebuffer';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { GLTexture2D, IGLStoredTextureBase, IGLTexture } from '../gl/core/texture/GLTexture';
import { Camera } from './Camera';
import { IRenderableInstance3D } from './IRenderableInstance3D';
import { DepthOnlyMaterial } from './Material/DepthOnlyMaterial';

const biasMat = mat4.fromValues(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

export class ShadowMap {
  protected _framebuffer: GLFramebuffer;
  private _camera: Camera<CameraLookAtTransform3D>;
  private _material: DepthOnlyMaterial;

  constructor(
    readonly renderer: GLRenderer,
    bufferWidth = 512,
    bufferHeight = 512,
    radius = 15,
    near = 0.001,
    far = 30,
    textureLocation = GLDefaultTextureLocation.SHADOW_MAP_0,
  ) {
    this._framebuffer = new GLFramebuffer(renderer.gl, bufferWidth, bufferHeight, true, false, true);
    this._camera = new Camera<CameraLookAtTransform3D>(CameraLookAtTransform3D).setOrtho(
      -radius,
      radius,
      -radius,
      radius,
      near,
      far,
    );
    this._material = new DepthOnlyMaterial(renderer);

    this._framebuffer.depthTexture.active(textureLocation);
  }

  resizeBuffer(width: number, height: number): void {
    this._framebuffer.resize(width, height);
  }

  resize(radius: number, near: number, far: number): void {
    this._camera.setOrtho(-radius, radius, -radius, radius, near, far);
  }

  setPosition(x: number, y: number, z: number): void {
    this._camera.transform.setPosition(x, y, z);
  }

  setLookAt(x: number, y: number, z: number): void {
    this._camera.transform.setLookAt(x, y, z);
  }

  setLookAtFromLight(light: { direction: vec3 }): void {
    this.setLookAt(light.direction[0], light.direction[1], light.direction[2]);
  }

  getRawPosition(): vec3 {
    return this._camera.transform.getRawPosition();
  }
  getRawLookAt(): vec3 {
    return this._camera.transform.getRawLookAt();
  }

  startRenderDepthMap(clear = true): void {
    this._framebuffer.bind();
    if (clear) this.renderer.clear();
  }

  stopRenderDepthMap(): void {
    this._framebuffer.unbind();
  }

  renderDepthMap(elements: IRenderableInstance3D[], clear?: boolean): void {
    const gl = this.renderer.gl;
    const cam = this._camera;
    const material = this._material;

    this.startRenderDepthMap(clear);
    for (let index = 0; index < elements.length; index++) {
      elements[index].render(gl, cam, material);
    }
    this.stopRenderDepthMap();
  }

  get depthTexture(): GLTexture2D {
    return this._framebuffer.depthTexture;
  }

  updateTransform(parentMat?: mat4): void {
    this._camera.updateTransform(parentMat);
  }

  depthBiasMvp(out: mat4, modelMat: mat4): void {
    this._camera.mvp(out, modelMat);
    mat4.multiply(out, biasMat, out);
  }

  destroy(): void {}
}
