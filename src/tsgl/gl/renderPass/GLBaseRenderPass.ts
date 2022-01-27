import { IResize } from '../../common/IResize';
import { IGLFrameBuffer } from '../core/framebuffer/IGLFrameBuffer';
import { GLCore } from '../core/GLCore';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLRenderer } from '../core/GLRenderer';
import { GLRenderPassOptions } from './GLRenderPassOptions';
import { GLRenderPassState } from './GLRenderPassState';
import { IGLBaseRenderPass } from './IGLBaseRenderPass';
import { renderPassOptionsToSettings } from './renderPassOptionsToSettings';


export class GLBaseRenderPass<
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize
  >
  extends GLCore<GLContext>
  implements GLRenderPassState<FramebufferT>, IGLBaseRenderPass<GLContext> {
  depthTestEnabled: boolean;
  depthFunction: number;
  alphaBlendingEnabled: boolean;
  alphaBlendingFuncSfactor: number;
  alphaBlendingFuncDfactor: number;
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  clearOnBegin: number;
  faceCullingEnabled: boolean;
  framebuffer: FramebufferT | null;
  clearColorR: number;
  clearColorG: number;
  clearColorB: number;
  clearColorA: number;

  constructor(readonly renderer: GLRenderer<GLContext>, options: GLRenderPassOptions<FramebufferT>) {
    super(renderer.gl);
    this.setOptions(options);
  }

  get width(): number {
    return this.viewportWidth;
  }

  get height(): number {
    return this.viewportHeight;
  }

  setOptions(options: GLRenderPassOptions<FramebufferT>): void {
    Object.assign(this, renderPassOptionsToSettings(this.renderer.gl, options));
  }

  patchOptions(options: Partial<GLRenderPassState<FramebufferT>>): void {
    Object.assign(this, options);
  }

  begin(forceStateUpdate = false): void {
    this.renderer.setGLPassState(this, forceStateUpdate);
  }

  end(): void {
    if (this.framebuffer !== null) {
      this.framebuffer.unbind;
    }
  }

  resize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;

    if (this.framebuffer) {
      this.framebuffer.resize(width, height);
    }
  }

  destroy(): void { }
}
