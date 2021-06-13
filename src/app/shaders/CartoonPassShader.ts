import { mat4, vec2 } from 'gl-matrix';
import {
  getDefaultAttributeLocation,
  setDefaultTextureLocation,
} from '../../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { AnyWebRenderingGLContext } from '../../tsgl/gl/core/GLHelpers';
import { GLRenderer } from '../../tsgl/gl/core/GLRenderer';
import { GLShader } from '../../tsgl/gl/core/shader/GLShader';
import { GLShaderState } from '../../tsgl/gl/core/shader/GLShaderState';
import { IGLShaderState } from '../../tsgl/gl/core/shader/IGLShaderState';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('./glsl/cartoonPass.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('./glsl/cartoonPass.vert').default;

export class CartoonPassShaderState extends GLShaderState implements IGLShaderState {
  readonly pixelSize = vec2.create();
  
  resize(width:number, height:number): void{
    this.pixelSize[0] = 1 / width;
    this.pixelSize[1] = 1 / height;
  }

  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniform2fv(uniformsLocations.u_pixelSize, this.pixelSize);

  }
}

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
