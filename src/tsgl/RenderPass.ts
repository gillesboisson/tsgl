import { IResize } from './base/IResize';
import { IGLFrameBuffer } from './gl/core/framebuffer/IGLFrameBuffer';
import { GLCore } from './gl/core/GLCore';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLRenderer } from './gl/core/GLRenderer';
import { IGLCore } from './gl/core/IGLCore';

export interface GLRenderPassOptions<FramebufferT extends IGLFrameBuffer & IResize> {
  depthTestEnabled?: boolean;
  depthFunction?: number;

  alphaBlendingEnabled?: boolean;
  alphaBlendingFuncSfactor?: number;
  alphaBlendingFuncDfactor?: number;
  clearOnBegin?: number;
  clearColorR?: number;
  clearColorG?: number;
  clearColorB?: number;
  clearColorA?: number;

  faceCullingEnabled?: boolean;

  framebuffer?: FramebufferT | null;

  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface GLRenderPassClearState {
  clearOnBegin: number;
  clearColorR: number;
  clearColorG: number;
  clearColorB: number;
  clearColorA: number;
}

export interface GLRenderPassAlphaBlendingState {
  alphaBlendingEnabled: boolean;
  alphaBlendingFuncSfactor: number;
  alphaBlendingFuncDfactor: number;
}

export interface GLRenderPassAlphaDepthState {
  depthTestEnabled: boolean;
  depthFunction: number;
}

export interface GLRenderPassAlphaViewportState {
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
}

export type GLRenderPassState<FramebufferT extends IGLFrameBuffer & IResize> = Required<
  GLRenderPassOptions<FramebufferT>
>;

export function renderPassOptionsToSettings<FramebufferT extends IGLFrameBuffer & IResize>(
  gl: AnyWebRenderingGLContext,
  options: GLRenderPassOptions<FramebufferT>,
): GLRenderPassState<FramebufferT> {
  return {
    depthTestEnabled: false,
    depthFunction: gl.LESS,
    alphaBlendingEnabled: false,
    alphaBlendingFuncSfactor: gl.SRC_ALPHA,
    alphaBlendingFuncDfactor: gl.ONE_MINUS_SRC_ALPHA,
    clearOnBegin: 0,
    framebuffer: options.framebuffer ? options.framebuffer : null,
    clearColorR: options.clearColorR !== undefined ? options.clearColorR : 0,
    clearColorG: options.clearColorG !== undefined ? options.clearColorG : 0,
    clearColorB: options.clearColorB !== undefined ? options.clearColorB : 0,
    clearColorA: options.clearColorA !== undefined ? options.clearColorA : 1,
    faceCullingEnabled: false,
    ...options,
  };
}

export interface IGLBaseRenderPass<GLContext extends AnyWebRenderingGLContext> extends IGLCore<GLContext>, IResize {
  begin(): void;
  end(): void;
}

export interface IRenderPass<RenderContextT, GLContext extends AnyWebRenderingGLContext>
  extends IGLBaseRenderPass<GLContext> {
  render(renderSettings: RenderContextT): void;
}

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

  destroy(): void {}
}

export abstract class ARenderPass<
    RenderContextT = null,
    GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
    FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize
  >
  extends GLBaseRenderPass<GLContext, FramebufferT>
  implements IRenderPass<RenderContextT, GLContext> {
  render(settings: RenderContextT): void {
    this.begin();
    this.draw(settings);
    this.end();
  }

  abstract draw(settings: RenderContextT): void;
}
