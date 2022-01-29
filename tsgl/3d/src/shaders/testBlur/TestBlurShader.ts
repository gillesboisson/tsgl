import { mat4 } from 'gl-matrix';
import { GLShaderState, GLShader, GLRenderer, AnyWebRenderingGLContext, getDefaultAttributeLocation, setDefaultTextureLocation } from '@tsgl/gl';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragSrc = require('../glsl/testBlur.frag').default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertSrc = require('../glsl/testBlur.vert').default;

export class TestBlurShaderState extends GLShaderState {
  syncUniforms(): void {
    const gl = this.gl;
    const uniformsLocations = this._uniformsLocations;

    gl.uniformMatrix4fv(uniformsLocations.u_mvpMat, false, this.mvp);
    gl.uniform1f(uniformsLocations.u_radius, this.radius);
    gl.uniform1f(uniformsLocations.u_textureWidth, this.textureWidth);
    gl.uniform1f(uniformsLocations.u_textureHeight, this.textureHeight);
    gl.uniform1f(uniformsLocations.u_textureLod, this.textureLod);
    gl.uniform1fv(uniformsLocations['u_kernel[0]'], this.kernel);


  }

  mvp: mat4 = mat4.create();
  radius = 1.001;
  textureWidth = 0;
  textureHeight = 0;
  textureLod = 0;
  kernel = new Float32Array([0,0.25,0,0.25,0,0.25,0,0.25,0]);
  // color: vec4 = vec4.create();
}

export const TestBlurShaderID = 'blur_test';

export class TestBlurShader extends GLShader<TestBlurShaderState> {
  static register(renderer: GLRenderer, kernelRadius = 2): void {
    renderer.registerShaderFactoryFunction( 
      TestBlurShaderID,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (gl: AnyWebRenderingGLContext, name: string) => new TestBlurShader(gl, kernelRadius),
    );
  }

  protected _kernelRadius: number;

  constructor(gl: AnyWebRenderingGLContext, kernelRadius: number) {
    const kernelOffset = kernelRadius - 1;
    const kernelWidth = kernelRadius + kernelOffset;
    const kernelLength = kernelWidth * kernelWidth;

    super(gl, vertSrc, fragSrc, TestBlurShaderState, getDefaultAttributeLocation(['a_position', 'a_uv']),{
      'KERNEL_LENGTH': kernelLength.toString(),
      'KERNEL_WIDTH': kernelWidth.toString(),
      'KERNEL_MIN': (-kernelOffset).toString(),
      'KERNEL_MAX': kernelOffset.toString(),
    });
    setDefaultTextureLocation(this, ['u_texture']);

    this._kernelRadius = kernelRadius;
  }

  
  public get kernelRadius() : number {
    return this._kernelRadius;
  }

  public get kernelLength() : number {
    return (this._kernelRadius + 1) * (this._kernelRadius + 1);
  }


  
}
