import { mat4 } from 'gl-matrix';
import { IResize } from '../base/IResize';
import { Transform3D } from '../geom/Transform3D';
import { ASceneInstance } from '../gl/abstract/ASceneInstance';
import { ITransform } from '../gl/abstract/ITransform';
import { IGLFrameBuffer } from '../gl/core/framebuffer/IGLFrameBuffer';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLRenderer } from '../gl/core/GLRenderer';
import { ARenderPass, GLRenderPassOptions, GLRenderPassState, renderPassOptionsToSettings } from '../RenderPass';
import { Camera } from './Camera';
import { IRenderableInstance3D } from './IRenderableInstance3D';
import { IMaterial } from './Material/IMaterial';
import { SceneInstance3D } from './SceneInstance3D';

export interface RenderPassRenderContext {
  cam: Camera;
}

export function renderPass3DptionsToSettings<FramebufferT extends IGLFrameBuffer & IResize>(
  gl: AnyWebRenderingGLContext,
  options: GLRenderPassOptions<FramebufferT>,
): GLRenderPassState<FramebufferT> {
  return renderPassOptionsToSettings(gl, {
    depthTestEnabled: true,
    alphaBlendingEnabled: true,
    clearOnBegin: gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
    faceCullingEnabled: true,
    ...options,
  });
}

export class RenderPass3D<
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize,
  TransformT extends ITransform<mat4> = Transform3D
> extends ARenderPass<RenderPassRenderContext, GLContext, FramebufferT> {
  constructor(
    renderer: GLRenderer<GLContext>,
    options: GLRenderPassOptions<FramebufferT>,
    readonly stage: SceneInstance3D<TransformT, IRenderableInstance3D<TransformT> & ASceneInstance<mat4, TransformT>>,
  ) {
    super(renderer, options);
  }

  material?: IMaterial;

  setOptions(options: GLRenderPassOptions<FramebufferT>): void {
    Object.assign(this, renderPass3DptionsToSettings(this.renderer.gl, options));
  }

  draw(settings: RenderPassRenderContext): void {
    const renderer = this.renderer;
    const nodes = this.stage.getNodes();
    for (const instance of this.stage.getNodes()) {
      this.renderInstance(renderer, instance, settings, this.material);
    }
  }
  protected renderInstance(
    renderer: GLRenderer<GLContext>,
    instance: IRenderableInstance3D<TransformT>,
    settings: RenderPassRenderContext,
    material?: IMaterial,
  ): void {
    instance.render(renderer.gl, settings.cam, material);
  }
}
