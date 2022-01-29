import { IResize } from '@tsgl/core';
import { createQuadMesh } from '@tsgl/gl';
import { GLMesh } from '@tsgl/gl';
import { IGLFrameBuffer } from '@tsgl/gl';
import { AnyWebRenderingGLContext } from '@tsgl/gl';
import { GLRenderer } from '@tsgl/gl';
import { IGLShaderState } from '@tsgl/gl';
import { IShaderCreateState } from '@tsgl/gl';
import { IGLTexture } from '@tsgl/gl';
import { GLRenderPassOptions } from '@tsgl/gl';
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
