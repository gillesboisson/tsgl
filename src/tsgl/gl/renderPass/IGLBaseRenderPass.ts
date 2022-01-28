import { IResize } from '../../core';
import { AnyWebRenderingGLContext } from '../core';
import { IGLCore } from '../core';


export interface IGLBaseRenderPass<GLContext extends AnyWebRenderingGLContext> extends IGLCore<GLContext>, IResize {
  begin(): void;
  end(): void;
}
