import { IResize } from '../../common/IResize';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { IGLCore } from '../core/IGLCore';


export interface IGLBaseRenderPass<GLContext extends AnyWebRenderingGLContext> extends IGLCore<GLContext>, IResize {
  begin(): void;
  end(): void;
}
