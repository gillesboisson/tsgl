import { GLCore } from '../GLCore';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLSupport } from '../GLSupport';
import { createEmptyTextureWithLinearFilter } from '../texture/createEmptyTextureWithLinearFilter';
import { IGLTexture } from '../texture/GLTexture';
import { IGLFrameBuffer } from './IGLFrameBuffer';

export class GLMRTFrameBuffer extends GLCore implements IGLFrameBuffer {
  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }

  private _isWebGL2: any;
  private _frameBuffer: WebGLFramebuffer;
  private _textures: IGLTexture[];
  private _depthTexture?: IGLTexture;
  private _depthRenderBuffer: WebGLFramebuffer;
  private _colorsAttachements: GLenum[];
  private _previousViewport: Int32Array = null;

  get textures(): IGLTexture[] {
    return this._textures;
  }

  get depthTexture(): IGLTexture {
    return this._depthTexture;
  }

  get framebuffer(): WebGLFramebuffer {
    return this._frameBuffer;
  }

  constructor(
    gl: AnyWebRenderingGLContext,
    protected _width: number,
    protected _height: number,
    protected _nbLayers: number,
    protected _useDepthTexture = false,
    protected _depthEnabled: boolean = true,
  ) {
    super(gl);
    GLSupport.MRTFrameBufferSupported(gl, true, true);

    if (_useDepthTexture) {
      GLSupport.depthTextureSupported(gl, true, true);
    }

    this._isWebGL2 = GLSupport.webGL2Supported(gl as WebGL2RenderingContext);
    this._frameBuffer = gl.createFramebuffer();

    this._textures = [];

    for (let i = 0; i < _nbLayers; i++) {
      const texture = createEmptyTextureWithLinearFilter(gl, _width, _height, gl.RGBA);

      this._textures.push(texture);
    }

    if (_useDepthTexture) {
      this._depthTexture = createEmptyTextureWithLinearFilter(gl, _width, _height, gl.RGBA);
    } else if (this._depthEnabled) {
      this._depthRenderBuffer = gl.createRenderbuffer();
    }

    this.updateSettings();
  }

  updateSettings(): void {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    this._colorsAttachements = new Array(this._nbLayers);

    // setup color textures
    if (this._isWebGL2) {
      // WEBGL 2 MRT
      const gl2 = gl as WebGL2RenderingContext;
      // gl2.bindRenderbuffer(gl.RENDERBUFFER, this._)
      // gl2.renderbufferStorageMultisample(gl.RENDERBUFFER, this._nbLayers, gl2.RGBA8, this._width, this._height);

      for (let i = 0; i < this._nbLayers; i++) {
        this._colorsAttachements[i] = gl2.COLOR_ATTACHMENT0 + i;
        gl.framebufferTexture2D(
          gl2.DRAW_FRAMEBUFFER,
          gl2.COLOR_ATTACHMENT0 + i,
          gl.TEXTURE_2D,
          this._textures[i].texture,
          0,
        );

        gl.bindTexture(gl.TEXTURE_2D, this._textures[i].texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    } else {
      for (let i = 0; i < this._nbLayers; i++) {
        this._colorsAttachements[i] = (gl as any).drawBuffersExt.COLOR_ATTACHMENT0_WEBGL + i;
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          (gl as any).drawBuffersExt.COLOR_ATTACHMENT0_WEBGL + i,
          gl.TEXTURE_2D,
          this._textures[i].texture,
          0,
        );

        gl.bindTexture(gl.TEXTURE_2D, this._textures[i].texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    }

    // setup depth texture
    if (this._useDepthTexture) {
      gl.bindTexture(this.gl.TEXTURE_2D, this._depthTexture.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        (gl as any).depthTextureExt !== undefined
          ? gl.DEPTH_COMPONENT
          : (gl as WebGL2RenderingContext).DEPTH_COMPONENT24,
        this._width,
        this._height,
        0,
        gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthTexture.texture, 0);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // setup depth render buffer
    if (this._depthRenderBuffer !== undefined) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    const gl = this.gl;

    for (const t of this._textures) {
      t.safeBind((t) => this.gl.texImage2D(t.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, null));
    }

    this._depthTexture.safeBind((t) => this.gl.texImage2D(t.target, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null));

    this.updateSettings();
  }

  bind(): void {
    this._previousViewport = this.gl.getParameter(this.gl.VIEWPORT);

    this.gl.viewport(0, 0, this._width, this._height);

    // console.log("> this.gl.viewport",this.width,this.height);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
    if (this._isWebGL2) (this.gl as WebGL2RenderingContext).drawBuffers(this._colorsAttachements);
    else (this.gl as any).drawBuffersExt.drawBuffersWEBGL(this._colorsAttachements);
    // this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._renderbuffer);
  }

  /**
   * unbind shortcut method
   */
  unbind(): void {
    if (this._previousViewport === null) throw new Error('Frame buffer has never been bind');

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(
      this._previousViewport[0],
      this._previousViewport[1],
      this._previousViewport[2],
      this._previousViewport[3],
    );

    this._previousViewport = null;
  }

  destroy(): void {
    const gl = this.gl;
    gl.deleteFramebuffer(this._frameBuffer);
    for (const t of this._textures) {
      gl.deleteTexture(t.texture);
    }
    if (this._depthTexture !== undefined) gl.deleteTexture(this._depthTexture.texture);

    if (this._depthRenderBuffer !== undefined) this.gl.deleteRenderbuffer(this._depthRenderBuffer);
  }
}
