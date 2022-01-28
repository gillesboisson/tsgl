import { IResize } from '../../core/IResize';
import { IGLFrameBuffer } from '../core/framebuffer/IGLFrameBuffer';


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
