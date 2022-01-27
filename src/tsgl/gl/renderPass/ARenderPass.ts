import { IResize } from '../../common/IResize';
import { IGLFrameBuffer } from '../core/framebuffer/IGLFrameBuffer';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLBaseRenderPass } from './GLBaseRenderPass';
import { IRenderPass } from './IRenderPass';


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
