import { CartoonPassShaderState } from './CartoonPassShaderState';
import { GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./cartoonPass.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./cartoonPass.vert').default;

export const CartoonPassShaderID = 'cartoon_pass';

export class CartoonPassShader extends GLShader<CartoonPassShaderState> {
  static register(renderer: GLRenderer): void {
    renderer.registerShaderFactoryFunction(
      CartoonPassShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new CartoonPassShader(gl),
    );
  }

  constructor(gl: AnyWebRenderingGLContext) {
    super(gl, vertSrc, fragSrc, CartoonPassShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']));
    setDefaultTextureLocation(this, ['u_texture', 'u_normalMap', 'u_lightDiffuseMap', 'u_lightSpecMap', 'u_depthMap']);
  }
}
