import { IResize } from '../../core';
import { createQuadMesh } from '../../gl';
import { GLMesh } from '../../gl';
import { IGLFrameBuffer } from '../../gl';
import { AnyWebRenderingGLContext } from '../../gl';
import { GLRenderer } from '../../gl';
import { IGLShaderState } from '../../gl';
import { IShaderCreateState } from '../../gl';
import { IGLTexture } from '../../gl';
import { GLRenderPassOptions } from '../../gl';
import { APostProcessPass } from './APostProcessPass';
import { mapMRTTexturesToProcessPassTexturesLocations } from './mapMRTTexturesToProcessPassTexturesLocations';
import { ProcessPassTextureLocation } from './ProcessPassTextureLocation';

export class PostProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  RenderContextT = undefined,
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize
> extends APostProcessPass<ShaderStateT, RenderContextT, GLContext, FramebufferT> {
  constructor(
    readonly renderer: GLRenderer<GLContext>,
    readonly inputTextureMap: ProcessPassTextureLocation[],
    options: GLRenderPassOptions<FramebufferT>,
    shader: IShaderCreateState<ShaderStateT>,
    quad: GLMesh = createQuadMesh(renderer.gl),
  ) {
    super(renderer, options, quad);
    this._shaderState = shader.createState() as ShaderStateT;
  }

  static createFromMRTFrameBuffer<ShaderStateT extends IGLShaderState = IGLShaderState>(
    renderer: GLRenderer,
    mrt: { textures: IGLTexture[]; depthTexture?: IGLTexture } & IGLFrameBuffer & IResize,
    textureLocation: GLint[],
    options: GLRenderPassOptions<{ textures: IGLTexture[]; depthTexture?: IGLTexture } & IGLFrameBuffer & IResize>,
    shader: IShaderCreateState<ShaderStateT>,
    quad: GLMesh = createQuadMesh(renderer.gl),
  ): PostProcessPass<ShaderStateT> {
    return new PostProcessPass(
      renderer,
      mapMRTTexturesToProcessPassTexturesLocations(mrt, textureLocation),
      options,
      shader,
      quad,
    );
  }

  syncUniforms(gl: AnyWebRenderingGLContext, ss: ShaderStateT, renderData?: RenderContextT): void {}

  prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void {
    this._shaderState.use();
    this.syncUniforms(gl, this._shaderState, renderData);
    this._shaderState.syncUniforms();
    for (const textureMap of this.inputTextureMap) {
      gl.activeTexture(gl.TEXTURE0 + textureMap.location);
      gl.bindTexture(gl.TEXTURE_2D, textureMap.texture);
    }
  }
  unbind(gl: AnyWebRenderingGLContext): void {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
