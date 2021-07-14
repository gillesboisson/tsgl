import { mat4, vec2, vec3 } from 'gl-matrix';
import { Camera } from '../tsgl/3d/Camera';
import { GLDefaultTextureLocation } from '../tsgl/gl/core/data/GLDefaultAttributesLocation';
import { WebGL2Renderer } from '../tsgl/gl/core/GLRenderer';
import { GLTexture2D, IGLTexture } from '../tsgl/gl/core/texture/GLTexture';
import { PostProcessPass } from '../tsgl/helpers/postprocess/PostProcessPass';
import { createEmptyTextureWithLinearNearestFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearNearestFilter';
import { SSAOBlurShaderID, SSAOBlurShaderState } from './shaders/SSAOBlurShader';


export class SSAOBlurPass extends PostProcessPass<SSAOBlurShaderState> {
  readonly fb: WebGLFramebuffer;
  private _ssaoTexture: GLTexture2D;
  private _rotationTexture: WebGLTexture;

  
  readonly kernelSR: number;



  get ssaoTexture():GLTexture2D{
    return this._ssaoTexture;
  }
  
  
  constructor(
    renderer: WebGL2Renderer,
    readonly sourceTexture: GLTexture2D,
  ) {
    super(renderer, [],{
      viewportX: 0,
      viewportY: 0,
      viewportWidth: renderer.width,
      viewportHeight: renderer.height,
    }, renderer.getShader<SSAOBlurShaderState>(SSAOBlurShaderID));
    const gl = renderer.gl;



    const fb = (this.fb = gl.createFramebuffer());
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    this._ssaoTexture = createEmptyTextureWithLinearNearestFilter(
      gl,
      sourceTexture.width,
      sourceTexture.height,
      gl.RGBA16F,
      gl.RGBA,
      gl.FLOAT,
    );
    

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoTexture.texture, 0);
  }

  prepare(gl: WebGL2RenderingContext): void {
    const ss = this._shaderState;
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    ss.use();

    this.sourceTexture.active(GLDefaultTextureLocation.COLOR);

    ss.texSize[0] = 1 / this.sourceTexture.width;
    ss.texSize[1] = 1 / this.sourceTexture.height;

    this._shaderState.syncUniforms();
  }

  unbind(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
