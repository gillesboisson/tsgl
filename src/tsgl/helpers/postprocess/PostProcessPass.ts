import { IResize } from '../../base/IResize';
import { createQuadMesh } from '../../geom/mesh/createQuadMesh';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { GLMRTFrameBuffer } from '../../gl/core/framebuffer/GLMRTFrameBuffer';
import { IGLFrameBuffer } from '../../gl/core/framebuffer/IGLFrameBuffer';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';
import { IShaderCreateState } from '../../gl/core/shader/IShaderProgram';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { ARenderPass, GLRenderPassOptions, IRenderPass } from '../../RenderPass';
import { mapMRTTexturesToProcessPassTexturesLocations } from './mapMRTTexturesToProcessPassTexturesLocations';

export interface IPostProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
  RenderContextT = undefined
> extends IRenderPass<RenderContextT, GLContext> {
  prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void;
}

export abstract class APostProcessPass<
    ShaderStateT extends IGLShaderState = IGLShaderState,
    RenderContextT = undefined,
    GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
    FramebufferT extends IGLFrameBuffer & IResize = IGLFrameBuffer & IResize
  >
  extends ARenderPass<RenderContextT, GLContext, FramebufferT>
  implements IPostProcessPass<ShaderStateT, GLContext, RenderContextT> {
  protected _shaderState: ShaderStateT;

  get shaderState(): ShaderStateT {
    return this._shaderState;
  }

  constructor(readonly renderer: GLRenderer<GLContext>, options: GLRenderPassOptions<FramebufferT>, readonly quad: GLMesh) {
    super(renderer, options);
  }

  abstract prepare(gl: AnyWebRenderingGLContext, shaderState: ShaderStateT, renderData: RenderContextT): void;

  draw(settings: RenderContextT): void {
    this.prepare(this.renderer.gl, this.shaderState, settings);
    this.quad.draw();
  }
}

export interface ProcessPassTextureLocation {
  texture: WebGLTexture;
  location: GLint;
}

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
