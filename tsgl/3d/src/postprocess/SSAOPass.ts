import { vec3 } from 'gl-matrix';
import { Camera, PostProcessPass } from '@tsgl/common';
import { GLRenderer, GLTexture2D, WebGL2Renderer, createSimpleResizableFramebuffer, GLDefaultTextureLocation } from '@tsgl/gl';
import { DeferredFrameBuffer } from '../deferred/DeferredFrameBuffer';
import { SSAOShaderState, SSAOShaderID } from '../shaders/ssao';


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

export interface SSAOShaderOptions {
  bias: number;
  radius: number;
  power: number;
}

export interface SSAOPassOptions {
  sourceFramebuffer: DeferredFrameBuffer,
  width?: number;
  height?: number;
  noiseKernelSize?: number;
  kernelSize?: number;
  bias?: number;
  radius?: number;
  power?: number;
}

export type SSAOPassSettings = Required<SSAOPassOptions>;

export interface SSAOPassRenderingData {
  cam: Camera;
}

function defaultSSAOPassSettings(renderer: GLRenderer, options: SSAOPassOptions): SSAOPassSettings {
  return {
    width: renderer.width,
    height: renderer.height,
    noiseKernelSize: 16,
    kernelSize: 64,
    bias: 0.1,
    radius: 0.5,
    power: 1,
    ...options,
  };
}

export class SSAOPass extends PostProcessPass<SSAOShaderState, SSAOPassRenderingData> {
  private _ssaoTexture: GLTexture2D;
  private _rotationTexture: WebGLTexture;
  readonly noiseKernelSize: number;
  readonly sourceFramebuffer: DeferredFrameBuffer;

  get ssaoTexture(): GLTexture2D {
    return this._ssaoTexture;
  }

  readonly settings: SSAOPassSettings;
  readonly kernelSR: number;

  constructor(renderer: WebGL2Renderer,  options: SSAOPassOptions) {
    const gl = renderer.gl;
    const settings = defaultSSAOPassSettings(renderer, options);

    const { framebuffer, texture } = createSimpleResizableFramebuffer(gl, settings.width, settings.height);

    super(
      renderer,
      [],
      {
        viewportX: 0,
        viewportY: 0,
        viewportWidth: renderer.width,
        viewportHeight: renderer.height,
        framebuffer,
      },
      renderer.getShader<SSAOShaderState>(SSAOShaderID),
    );

    this.sourceFramebuffer = settings.sourceFramebuffer;
    this.kernelSR = Math.sqrt(settings.noiseKernelSize);
    this.noiseKernelSize = settings.noiseKernelSize;
    this.settings = settings;

    this._rotationTexture = genSSAORandomRotation(renderer.gl, settings.noiseKernelSize);

    this._shaderState.updateKernel(genSSAOKernel(settings.kernelSize), settings.kernelSize);
    this._shaderState.updateSettings(this.settings);

    this._ssaoTexture = texture;
  }

  prepare(gl: WebGL2RenderingContext, shaderState: SSAOShaderState, renderingData: SSAOPassRenderingData): void {
    const sourceFramebuffer = this.sourceFramebuffer;

    // gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
