import { IGLShaderState, AnyWebRenderingGLContext, IRenderPass } from '@tsgl/gl';



export interface IPostProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  RenderContextT = undefined
  > extends IRenderPass<RenderContextT, GLContext> {
  prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void;
}
