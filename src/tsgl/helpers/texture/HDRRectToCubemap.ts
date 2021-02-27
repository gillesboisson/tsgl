import { mat4, vec3 } from 'gl-matrix';
import { EquiToCubemapShaderID, EquiToCubemapShaderState } from '../../../app/shaders/EquiToCubemapShader';
import { IrradianceShaderID, IrradianceShaderState } from '../../../app/shaders/IrradianceShader';
import { IDestroy } from '../../base/IDestroy';
import { createSkyBoxMesh } from '../../geom/mesh/createSkyBoxMesh';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLRenderer, WebGL2Renderer } from '../../gl/core/GLRenderer';
import { IGLTexture } from '../../gl/core/GLTexture';
import { createFramebufferWithDepthStorage } from '../framebuffer';
import { ACubemapRenderer } from './CubemapRenderer';

export class HDRToCubemap extends ACubemapRenderer<WebGL2RenderingContext> implements IDestroy {
  private _framebuffer: WebGLFramebuffer;
  private _depthRenderBuffer: WebGLRenderbuffer;
  private _skybox: GLMesh;

  public source: WebGLTexture;
  public dest: WebGLTexture;
  private _shaderState: IrradianceShaderState;

  constructor(readonly renderer: WebGL2Renderer, readonly size: number, framebuffer?: WebGLFramebuffer) {
    super(renderer.gl);
    const gl = this.gl;
    this._skybox = createSkyBoxMesh(gl);
    this._framebuffer = gl.createFramebuffer();
    this._depthRenderBuffer = gl.createRenderbuffer();

    if (framebuffer) {
      this._framebuffer = framebuffer;
    } else {
      const { framebuffer, depthRenderBuffer } = createFramebufferWithDepthStorage(
        gl,
        size,
        size,
        gl.DEPTH_COMPONENT24,
      );

      this._framebuffer = framebuffer;
      this._depthRenderBuffer = depthRenderBuffer;
    }

    this._shaderState = renderer.getShader<EquiToCubemapShaderState>(EquiToCubemapShaderID).createState();
  }

  destroy(): void {}

  protected bind(): void {
    const gl = this.gl;
    this._shaderState.use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.source);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
    gl.viewport(0, 0, this.size, this.size);
  }
  protected renderFace(
    gl: AnyWebRenderingGLContext,
    faceTarget: number,
    faceCam: mat4,
    faceOrientation: vec3,
    faceIndex: number,
  ): void {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
      this.dest,
      0,
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this._shaderState.mvp = faceCam;
    this._shaderState.syncUniforms();
    this._skybox.draw();
  }
  protected unbind(): void {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
