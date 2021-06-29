import { mat4, vec2, vec3 } from 'gl-matrix';
import { Camera } from '../tsgl/3d/Camera';
import { GLDefaultTextureLocation } from '../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { WebGL2Renderer } from '../tsgl/gl/core/GLRenderer';
import { GLTexture2D, IGLTexture } from '../tsgl/gl/core/texture/GLTexture';
import { ProcessPass } from '../tsgl/helpers/postprocess/PostProcessPass';
import { createEmptyTextureWithLinearNearestFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearNearestFilter';
import { DeferredFrameBuffer } from './DeferredFrameBuffer';
import { PbrDeferredVShaderID } from './shaders/PbrDeferredVShader';
import { PbrDeferredVShadersState } from './shaders/PbrDeferredVShadersState';
import { SSRShaderID, SSRShaderState } from './shaders/SSRShader';

export interface SSRPassRenderingData {
  cam: Camera;
}

export class SSRPass extends ProcessPass<SSRShaderState, SSRPassRenderingData> {
  readonly framebuffer: WebGLFramebuffer;
  private _ssrTexture: GLTexture2D;
  private _rotationTexture: WebGLTexture;

  get ssrTexture(): GLTexture2D {
    return this._ssrTexture;
  }

  readonly kernelSR: number;

  constructor(
    renderer: WebGL2Renderer,
    readonly sourceFramebuffer: DeferredFrameBuffer,
    readonly colorTexture: GLTexture2D = sourceFramebuffer.albedo,
  ) {
    super(renderer, [], renderer.getShader<SSRShaderState>(SSRShaderID));
    const gl = renderer.gl;

    const fb = (this.framebuffer = gl.createFramebuffer());
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    this._ssrTexture = createEmptyTextureWithLinearNearestFilter(
      gl,
      sourceFramebuffer.width,
      sourceFramebuffer.height,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
    );

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssrTexture.texture, 0);
  }

  prepare(gl: WebGL2RenderingContext, renderingData: SSRPassRenderingData): void {
    const ss = this._shaderState;
    const sourceFramebuffer = this.sourceFramebuffer;

    // gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ss.use();

    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.NORMAL);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.normalMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.POSITION);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.positionMap.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.DEPTH);
    gl.bindTexture(gl.TEXTURE_2D, sourceFramebuffer.depthTexture.texture);
    gl.activeTexture(gl.TEXTURE0 + GLDefaultTextureLocation.COLOR);
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture.texture);

    renderingData.cam.p(ss.pMat);
    // mat4.invert(ss.pzMat, ss.pMat);

    vec2.set(ss.texSize, this.colorTexture.width, this.colorTexture.height);

    this._shaderState.syncUniforms();
  }

  unbind(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
