import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '../../../../tsgl/gl';
import { DeferredDebugPassShaderState } from './DeferredDebugPassShaderState';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./deferredDebugPass.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./deferredDebugPass.vert').default;

export const DeferredDebugPassShaderID = 'deferred_debug_pass';

export class DeferredDebugPassShader extends GLShader<DeferredDebugPassShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      DeferredDebugPassShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new DeferredDebugPassShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, DeferredDebugPassShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture', 'u_normalMap', 'u_positionMap', 'u_depthMap']);
  }
}
