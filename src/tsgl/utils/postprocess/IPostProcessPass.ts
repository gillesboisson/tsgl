import { AnyWebRenderingGLContext } from '../../gl';
import { IGLShaderState } from '../../gl';
import { IRenderPass } from '../../gl';


export interface IPostProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  RenderContextT = undefined
  > extends IRenderPass<RenderContextT, GLContext> {
  prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void;
}
