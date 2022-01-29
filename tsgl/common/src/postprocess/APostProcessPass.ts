import { IResize } from '@tsgl/core';
import { GLMesh } from '@tsgl/gl';
import { IGLFrameBuffer } from '@tsgl/gl';
import { AnyWebRenderingGLContext } from '@tsgl/gl';
import { GLRenderer } from '@tsgl/gl';
import { IGLShaderState } from '@tsgl/gl';
import { ARenderPass } from '@tsgl/gl';
import { GLRenderPassOptions } from '@tsgl/gl';
import { IPostProcessPass } from './IPostProcessPass';


export abstract class APostProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  RenderContextT = undefined,
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize
  >
  extends ARenderPass<RenderContextT, GLContext, FramebufferT>
  implements IPostProcessPass<ShaderStateT, GLContext, RenderContextT> {
  protected _shaderState: ShaderStateT;

  get shaderState(): ShaderStateT {
    return this._shaderState;
  }

  constructor(
    readonly renderer: GLRenderer<GLContext>,
    options: GLRenderPassOptions<FramebufferT>,
    readonly quad: GLMesh
  ) {
    super(renderer, options);
  }

  abstract prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void;

  draw(settings: RenderContextT): void {
    this.prepare(this.renderer.gl, this.shaderState, settings);
    this.quad.draw();
  }
}
