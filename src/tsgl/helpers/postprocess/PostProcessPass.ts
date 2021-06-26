import { createQuadMesh } from '../../geom/mesh/createQuadMesh';
import { GLDefaultTextureLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { GLMRTFrameBuffer } from '../../gl/core/framebuffer/GLMRTFrameBuffer';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { IGLShaderState } from '../../gl/core/shader/IGLShaderState';
import { IShaderCreateState } from '../../gl/core/shader/IShaderProgram';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { mapMRTTexturesToProcessPassTexturesLocations } from './mapMRTTexturesToProcessPassTexturesLocations';

export interface IPostProcessPass<ShaderStateT extends IGLShaderState = IGLShaderState, RenderDataT = undefined> {
  unbind(gl: AnyWebRenderingGLContext): void;
  prepare(gl: AnyWebRenderingGLContext, renderData?: RenderDataT): void;
  draw(gl: AnyWebRenderingGLContext, quad?: GLMesh): void;
}

export abstract class APostProcessPass<ShaderStateT extends IGLShaderState = IGLShaderState, RenderDataT = undefined>
  implements IPostProcessPass<ShaderStateT, RenderDataT> {
  protected _shaderState: ShaderStateT;

  get shaderState(): ShaderStateT {
    return this._shaderState;
  }

  constructor(readonly quad: GLMesh) {}

  abstract prepare(gl: AnyWebRenderingGLContext, renderData?: RenderDataT): void;
  abstract unbind(gl: AnyWebRenderingGLContext): void;
  draw(gl: AnyWebRenderingGLContext, quad: GLMesh = this.quad): void {
    quad.draw();
  }

  render(gl: AnyWebRenderingGLContext, renderData?: RenderDataT, quad: GLMesh = this.quad): void {
    this.prepare(gl, renderData);
    this.draw(gl, quad);
    this.unbind(gl);
  }
}

export interface ProcessPassTextureLocation {
  texture: WebGLTexture;
  location: GLint;
}

export class ProcessPass<
  ShaderStateT extends IGLShaderState = IGLShaderState,
  RenderDataT = undefined
> extends APostProcessPass<ShaderStateT, RenderDataT> {
  constructor(
    readonly renderer: GLRenderer,
    readonly inputTextureMap: ProcessPassTextureLocation[],
    shader: IShaderCreateState<ShaderStateT>,
    quad: GLMesh = createQuadMesh(renderer.gl),
  ) {
    super(quad);
    this._shaderState = shader.createState() as ShaderStateT;
  }

  static createFromMRTFrameBuffer<ShaderStateT extends IGLShaderState = IGLShaderState>(
    renderer: GLRenderer,
    mrt: { textures: IGLTexture[]; depthTexture?: IGLTexture },
    textureLocation: GLint[],
    shader: IShaderCreateState<ShaderStateT>,
    quad: GLMesh = createQuadMesh(renderer.gl),
  ): ProcessPass<ShaderStateT> {
    return new ProcessPass(renderer, mapMRTTexturesToProcessPassTexturesLocations(mrt, textureLocation), shader, quad);
  }

  syncUniforms(gl: AnyWebRenderingGLContext, ss: ShaderStateT, renderData?: RenderDataT): void {}

  prepare(gl: AnyWebRenderingGLContext, renderData?: RenderDataT): void {
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
