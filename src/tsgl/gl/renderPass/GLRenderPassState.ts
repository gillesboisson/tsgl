import { IResize } from '../../core/IResize';
import { IGLFrameBuffer } from '../core/framebuffer/IGLFrameBuffer';
import { GLRenderPassOptions } from './GLRenderPassOptions';


export type GLRenderPassState<FramebufferT extends IGLFrameBuffer & IResize> = Required<
  GLRenderPassOptions<FramebufferT>
>;
