import { mat4, vec2, vec3 } from 'gl-matrix';
import { Camera } from '../tsgl/3d/Camera';
import { GLDefaultTextureLocation } from '../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { createSimpleResizableFramebuffer } from '../tsgl/gl/core/framebuffer/createSimpleResizableFramebuffer';
import { GLRenderer, WebGL2Renderer } from '../tsgl/gl/core/GLRenderer';
import { GLTexture2D, IGLTexture } from '../tsgl/gl/core/texture/GLTexture';
import { PostProcessPass } from '../tsgl/helpers/postprocess/PostProcessPass';
import { createEmptyTextureWithLinearNearestFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearNearestFilter';
import { SSAOBlurShaderID, SSAOBlurShaderState } from './shaders/SSAOBlurShader';

export interface SSAOBlurPassOptions {
  width?: number;
  height?: number;
  sourceTexture: GLTexture2D;
}

export type SSAOBlurPassSettings = Required<SSAOBlurPassOptions>;

function defaultSSAOPassSettings(renderer: GLRenderer, options: SSAOBlurPassOptions): SSAOBlurPassSettings {
  return {
    width: renderer.width,
    height: renderer.height,
    ...options,
  };
}

export class SSAOBlurPass extends PostProcessPass<SSAOBlurShaderState> implements SSAOBlurPassSettings {
  readonly fb: WebGLFramebuffer;
  private _ssaoTexture: GLTexture2D;
  readonly sourceTexture: GLTexture2D;
  readonly kernelSR: number;

  get ssaoTexture(): GLTexture2D {
    return this._ssaoTexture;
  }

  constructor(renderer: WebGL2Renderer, options: SSAOBlurPassOptions) {
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
      renderer.getShader<SSAOBlurShaderState>(SSAOBlurShaderID),
    );

    this._ssaoTexture = texture;
    this.sourceTexture = settings.sourceTexture;
  }

  prepare(gl: WebGL2RenderingContext): void {
    const ss = this._shaderState;
    ss.use();

    this.sourceTexture.active(GLDefaultTextureLocation.COLOR);

    ss.texSize[0] = 1 / this.sourceTexture.width;
    ss.texSize[1] = 1 / this.sourceTexture.height;

    this._shaderState.syncUniforms();
  }

}
