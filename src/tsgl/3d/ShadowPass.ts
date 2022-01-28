import { mat4, vec3 } from 'gl-matrix';
import { CameraLookAtTransform3D } from '../common/transform/CameraTargetTransform3D';
import { GLDefaultTextureLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { GLFramebuffer } from '../gl/core/framebuffer/GLFramebuffer';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { DepthOnlyMaterial } from './Material/DepthOnlyMaterial';
import { IMaterial } from '../common/primitive/IMaterial';
import { RenderPass3D, RenderPassRenderContext } from './RenderPass3D';
import { SceneInstance3D } from '../common/primitive/SceneInstance3D';
import { Camera, IRenderableInstance3D } from '../common';

export const biasMat = mat4.fromValues(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

const tMat = mat4.create();

export interface ShadowPassOptions {
  width?: number;
  height?: number;
  radius?: number;
  near?: number;
  far?: number;
}

export type ShadowPassSettings = Required<ShadowPassOptions>;

export function shadowSettingsFromOptions(renderer: GLRenderer, options: ShadowPassOptions): ShadowPassSettings {
  return {
    width: renderer.width,
    height: renderer.height,
    radius: 15,
    near: 0.001,
    far: 30,
    ...options,
  };
}

export class ShadowPass extends RenderPass3D<AnyWebRenderingGLContext, GLFramebuffer> implements ShadowPassSettings {
  readonly far: number;
  readonly near: number;
  readonly radius: number;
  readonly camera: Camera<CameraLookAtTransform3D>;

  constructor(renderer: GLRenderer, options: ShadowPassOptions, stage: SceneInstance3D) {
    const settings = shadowSettingsFromOptions(renderer, options);
    const framebuffer = new GLFramebuffer(renderer.gl, settings.width, settings.height, true, false, true);
    super(
      renderer,
      {
        depthTestEnabled: true,
        clearOnBegin: renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT,
        faceCullingEnabled: true,
        alphaBlendingEnabled: false,
        viewportX: 0,
        viewportY: 0,
        viewportHeight: settings.height,
        viewportWidth: settings.width,
        framebuffer,
      },
      stage,
    );

    // setup material and camera
    this.material = new DepthOnlyMaterial(renderer);
    this.camera = new Camera<CameraLookAtTransform3D>(CameraLookAtTransform3D).setOrtho(
      -settings.radius,
      settings.radius,
      -settings.radius,
      settings.radius,
      settings.near,
      settings.far,
    );

    // setup texture location
    const textureLocation = GLDefaultTextureLocation.SHADOW_MAP_0;
    (this.framebuffer as GLFramebuffer).depthTexture.active(textureLocation);

    // copy settings to object
    this.near = settings.near;
    this.far = settings.far;
    this.radius = settings.radius;
  }

  protected renderInstance(
    renderer: GLRenderer,
    instance: IRenderableInstance3D,
    settings: RenderPassRenderContext,
    material?: IMaterial,
  ): void {
    instance.render(renderer.gl, this.camera, material);
  }

  updateCamera(radius: number, near: number, far: number): void {
    this.camera.setOrtho(-radius, radius, -radius, radius, near, far);
  }

  setPosition(x: number, y: number, z: number): void {
    this.camera.transform.setPosition(x, y, z);
  }

  setLookAt(x: number, y: number, z: number): void {
    this.camera.transform.setLookAt(x, y, z);
  }

  setLookAtFromLight(light: { direction: vec3 }): void {
    this.setLookAt(light.direction[0], light.direction[1], light.direction[2]);
  }

  getRawPosition(): vec3 {
    return this.camera.transform.getRawPosition();
  }
  getRawLookAt(): vec3 {
    return this.camera.transform.getRawLookAt();
  }

  updateTransform(parentMat?: mat4): void {
    this.camera.updateTransform(parentMat);
    // if(this.viewSpaceCamera !== null){
    //   const localMat = this.camera.transform.getLocalMat();
    //   const worldMat = parentMat ? mat4.multiply(tMat, parentMat, localMat) : localMat;
    //   mat4.multiply(tMat, this.viewSpaceCamera.invertWorldMat, worldMat);
    //   mat4.invert(tMat,tMat);
    //   mat4.multiply(this.viewSpaceMat, this.camera.vpMat, tMat);
    // }else{
    //   this.camera.vp(this.viewSpaceMat);
    // }
  }

  depthBiasMvp(out: mat4, modelMat: mat4): void {
    this.camera.mvp(out, modelMat);
    mat4.multiply(out, biasMat, out);
  }

  /**
   *
   * @param out matrix used to store result
   */
  depthBiasVp(out: mat4): void {
    this.camera.vp(out);
    mat4.multiply(out, biasMat, out);
  }

  depthBiasVpInForViewSpaceData(out: mat4, viewCamera: Camera): void {
    const worldMat = this.camera.getWorldMat();
    mat4.multiply(out, viewCamera.invertWorldMat, worldMat);
    mat4.invert(out, out);
    mat4.multiply(out, this.camera.projectionMat, out);
    mat4.multiply(out, biasMat, out);
  }
}
