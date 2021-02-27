import { mat4, vec3 } from 'gl-matrix';
import { IDestroy } from '../base/IDestroy';
import { createSkyBoxMesh } from '../geom/mesh/createSkyBoxMesh';
import { GLMesh } from '../gl/core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { WebGL2Renderer } from '../gl/core/GLRenderer';
import { createFramebufferWithDepthStorage } from '../helpers/framebuffer';
import { ACubemapRenderer } from '../helpers/texture/CubemapRenderer';
import { IrradianceShaderState, IrradianceShaderID } from '../shaders/IrradianceShader';


export class IrradianceCubemapRenderer extends ACubemapRenderer<WebGL2RenderingContext> implements IDestroy {
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
    this._shaderState = renderer.getShader<IrradianceShaderState>(IrradianceShaderID).createState();
  }

  destroy(destroyFramebuffer = true, destroyDepthRenderBuffer = true): void {
    if (destroyDepthRenderBuffer && this._depthRenderBuffer) {
      this.gl.deleteRenderbuffer(this._depthRenderBuffer);
    }

    if (destroyFramebuffer) {
      this.gl.deleteFramebuffer(this._framebuffer);
    }
  }

  protected bind(): void {
    const gl = this.gl;
    this._shaderState.use();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.source);
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
