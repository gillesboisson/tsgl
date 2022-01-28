import { IResize } from '../../core';
import { IGLFrameBuffer } from '../core';
import { GLRenderPassOptions } from './GLRenderPassOptions';


export type GLRenderPassState<FramebufferT extends IGLFrameBuffer & IResize> = Required<
  GLRenderPassOptions<FramebufferT>
>;
