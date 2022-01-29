
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';
import { CopyShaderState } from './CopyShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./copy.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./copy.vert').default;

export const CopyShaderID = 'copy';

export class CopyShader extends GLShader<CopyShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      CopyShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new CopyShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, CopyShaderState,getDefaultAttributeLocation(['a_position','a_uv']));
    setDefaultTextureLocation(this, ['u_texture']);
  }
}
