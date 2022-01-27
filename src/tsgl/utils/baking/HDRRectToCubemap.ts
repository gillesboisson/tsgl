import { mat4, vec3 } from 'gl-matrix';
import { IDestroy } from '../../common/IDestroy';
import { createSkyBoxMesh } from '../../gl';
import { GLMesh } from '../../gl';
import { AnyWebRenderingGLContext } from '../../gl';
import {  WebGL2Renderer } from '../../gl';
import { ACubemapRenderer } from '../../gl';
import { EquiToCubemapShaderState, EquiToCubemapShaderID } from '../../shaders/EquiToCubemapShader';
import { IrradianceShaderState } from '../../shaders/IrradianceShader';

export class HDRToCubemap extends ACubemapRenderer<WebGL2RenderingContext> implements IDestroy {
  private _framebuffer: WebGLFramebuffer;
  private _skybox: GLMesh;

  public source: WebGLTexture;
  public dest: WebGLTexture;
  private _shaderState: IrradianceShaderState;

  constructor(readonly renderer: WebGL2Renderer, readonly size: number, framebuffer?: WebGLFramebuffer) {
    super(renderer.gl);
    const gl = this.gl;
    this._skybox = createSkyBoxMesh(gl);
    this._framebuffer = framebuffer || gl.createFramebuffer();

    this._shaderState = renderer.getShader<EquiToCubemapShaderState>(EquiToCubemapShaderID).createState();
  }

  destroy(destroyFramebuffer = true): void {
    this.gl.deleteFramebuffer(this._framebuffer);
  }

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
