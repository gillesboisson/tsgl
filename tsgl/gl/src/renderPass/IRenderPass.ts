import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { IGLBaseRenderPass } from './IGLBaseRenderPass';


export interface IRenderPass<RenderContextT, GLContext extends AnyWebRenderingGLContext>
  extends IGLBaseRenderPass<GLContext> {
  render(renderSettings: RenderContextT): void;
}
