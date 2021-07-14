import { mat4, vec2, vec3 } from 'gl-matrix';
import { Camera } from '../tsgl/3d/Camera';
import { GLDefaultTextureLocation } from '../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { WebGL2Renderer } from '../tsgl/gl/core/GLRenderer';
import { GLTexture2D, IGLTexture } from '../tsgl/gl/core/texture/GLTexture';
import { PostProcessPass } from '../tsgl/helpers/postprocess/PostProcessPass';
import { createEmptyTextureWithLinearNearestFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearNearestFilter';
import { DeferredFrameBuffer } from './DeferredFrameBuffer';
import { PbrDeferredVShaderID } from './shaders/PbrDeferredVShader';
import { PbrDeferredVShadersState } from './shaders/PbrDeferredVShadersState';
import { SSAOShaderID, SSAOShaderState } from './shaders/SSAOShader';

function lerp(min: number, max: number, val: number) {
  return val * (max - min) + min;
}

export const SHADER_KERNEL_BUFFER_SIZE = 64;

function genSSAOKernel(size: number): Float32Array {
  const res = new Float32Array(SHADER_KERNEL_BUFFER_SIZE * 3);

  for (let i = 0; i < size; i++) {
    const v: vec3 = new Float32Array(res.buffer, i * Float32Array.BYTES_PER_ELEMENT * 3, 3) as vec3;

    let scale = i / size;
    scale = lerp(0.1, 1, scale * scale);

    vec3.set(v, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random());
    vec3.normalize(v, v);
    vec3.scale(v, v, scale);
  }

  return res;
}

function genSSAORandomRotation(gl: WebGL2RenderingContext, size = 16): WebGLTexture {
  const res = new Float32Array(size * 4);
  
  for (let i = 0; i < size; i++) {
    const v: vec3 = new Float32Array(res.buffer, i * Float32Array.BYTES_PER_ELEMENT * 4, 3) as vec3;
    vec3.set(v, Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
  }

  const texture = gl.createTexture();
  const target = gl.TEXTURE_2D;

  gl.bindTexture(target, texture);
  gl.texImage2D(target, 0, gl.RGBA16F, size / 4, size / 4, 0, gl.RGBA, gl.FLOAT, res);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  return texture;
}

export interface SSAOShaderSettings{
  bias:number,
  radius:number,
  power:number,
}

export interface SSAOPassRenderingData {
  cam: Camera;
}

export class SSAOPass extends PostProcessPass<SSAOShaderState, SSAOPassRenderingData> {
  readonly fb: WebGLFramebuffer;
  private _ssaoTexture: GLTexture2D;
  private _rotationTexture: WebGLTexture;

  get ssaoTexture():GLTexture2D{
    return this._ssaoTexture;
  }
  
  

  readonly settings: SSAOShaderSettings = {
    bias: 0.1,
    radius: 0.5,
    power: 1,
  }
  readonly kernelSR: number;

  constructor(
    renderer: WebGL2Renderer,
    readonly sourceFramebuffer: DeferredFrameBuffer,
    readonly noiseKernelSize = 16,
    kernelSize = 64,
  ) {
    super(renderer, [],{
      viewportX: 0,
      viewportY: 0,
      viewportWidth: renderer.width,
      viewportHeight: renderer.height,
    }, renderer.getShader<SSAOShaderState>(SSAOShaderID));
    const gl = renderer.gl;

    this.kernelSR = Math.sqrt(noiseKernelSize);

    const ext = gl.getExtension('EXT_color_buffer_float');

    if (!ext) {
      throw new Error('EXT_color_buffer_float not available but SSAO require it for high precision buffer');
    }

    this._rotationTexture = genSSAORandomRotation(renderer.gl, noiseKernelSize);

    this._shaderState.updateKernel(genSSAOKernel(kernelSize), kernelSize);
    this._shaderState.updateSettings(this.settings);

    const fb = (this.fb = gl.createFramebuffer());
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    this._ssaoTexture = createEmptyTextureWithLinearNearestFilter(
      gl,
      sourceFramebuffer.width,
      sourceFramebuffer.height,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
    );
   

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoTexture.texture, 0);
  }

  prepare(gl: WebGL2RenderingContext, shaderState: SSAOShaderState, renderingData: SSAOPassRenderingData): void {
    const sourceFramebuffer = this.sourceFramebuffer;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shaderState.use();

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.depthTexture.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.SSAO_ROTATION);
    gl.bindTexture(gl.TEXTURE_2D, this._rotationTexture);

    renderingData.cam.p(shaderState.pMat);
    renderingData.cam.v(shaderState.vMat);
    //mat4.copy(shaderState.vMat, renderingData.cam.transform.getLocalMat());



    shaderState.noiseScale[0] = this.renderer.width / 4;
    shaderState.noiseScale[1] = this.renderer.height / 4;

    this._shaderState.syncUniforms();
  }

  unbind(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
