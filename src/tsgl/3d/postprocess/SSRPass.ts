import { vec2 } from 'gl-matrix';
import { Camera, PostProcessPass } from '../../common';
import { GLTexture2D, GLRenderer, AnyWebRenderingGLContext, WebGL2Renderer, createSimpleResizableFramebuffer, GLDefaultTextureLocation } from '../../gl';
import { DeferredFrameBuffer } from '../deferred/DeferredFrameBuffer';
import { SSRShaderState, SSRShaderID } from '../shaders/ssr';

export interface SSRPassRenderingData {
  cam: Camera;
}


export interface SSRPassOptions {
  sourceFramebuffer: DeferredFrameBuffer;
  width?: number;
  height?: number;
  colorTexture?: GLTexture2D;
}

export type SSRPassSettings = Required<SSRPassOptions>;

function defaultSettings(renderer: GLRenderer, options: SSRPassOptions): SSRPassSettings {
  return {
    width: renderer.width,
    height: renderer.height,
    colorTexture: options.sourceFramebuffer.albedo,
    ...options,
  };
}
export class SSRPass extends PostProcessPass<SSRShaderState, SSRPassRenderingData> implements SSRPassSettings {
  readonly fb: WebGLFramebuffer;
  private _ssrTexture: GLTexture2D;
  private _rotationTexture: WebGLTexture;
  readonly sourceFramebuffer: DeferredFrameBuffer;
  readonly colorTexture: GLTexture2D<AnyWebRenderingGLContext>;

  get ssrTexture(): GLTexture2D {
    return this._ssrTexture;
  }

  readonly kernelSR: number;

  constructor(renderer: WebGL2Renderer, options: SSRPassOptions) {
    const gl = renderer.gl;
    const settings = defaultSettings(renderer, options);
    const { framebuffer, texture } = createSimpleResizableFramebuffer(gl, settings.width, settings.height);

    super(
      renderer,
      [],
      {
        viewportX: 0,
        viewportY: 0,
        viewportWidth: settings.width,
        viewportHeight: settings.height,
        clearOnBegin: renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT,
        // framebuffer,
      },
      renderer.getShader<SSRShaderState>(SSRShaderID),
    );

    this.sourceFramebuffer = settings.sourceFramebuffer;
    this.colorTexture = settings.colorTexture;
      
  }

  prepare(gl: WebGL2RenderingContext, shaderState: SSRShaderState, renderingData: SSRPassRenderingData): void {
    const sourceFramebuffer = this.sourceFramebuffer;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shaderState.use();

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.depthTexture.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.COLOR);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture.texture);

    renderingData.cam.p(shaderState.pMat);

    vec2.set(shaderState.texSize, this.colorTexture.width, this.colorTexture.height);

    this._shaderState.syncUniforms();
  }

 
}
