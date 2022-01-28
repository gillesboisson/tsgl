import { IResize } from '../../core';
import { IGLFrameBuffer } from '../core';
import { AnyWebRenderingGLContext } from '../core';
import { GLRenderPassOptions } from './GLRenderPassOptions';
import { GLRenderPassState } from './GLRenderPassState';


export function renderPassOptionsToSettings<FramebufferT extends IGLFrameBuffer & IResize>(
  gl: AnyWebRenderingGLContext,
  options: GLRenderPassOptions<FramebufferT>
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
