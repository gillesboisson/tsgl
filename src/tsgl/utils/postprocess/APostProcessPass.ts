import { IResize } from '../../common/IResize';
import { GLMesh } from '../../gl';
import { IGLFrameBuffer } from '../../gl';
import { AnyWebRenderingGLContext } from '../../gl';
import { GLRenderer } from '../../gl';
import { IGLShaderState } from '../../gl';
import { ARenderPass } from '../../gl';
import { GLRenderPassOptions } from '../../gl';
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
