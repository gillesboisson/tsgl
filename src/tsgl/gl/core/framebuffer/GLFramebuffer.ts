import { GLCore } from '../GLCore';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IGLTexture } from '../GLTexture';
import { GLSupport } from '../GLSupport';
import { IGLFrameBuffer } from './IGLFrameBuffer';
import { GLViewportState } from './GLViewportState';
import { createEmptyTextureWithLinearFilter } from '../../../helpers/texture/createEmptyTextureWithLinearFilter';

export class GLFramebuffer extends GLCore implements IGLFrameBuffer, GLViewportState {
  get depthTexture(): IGLTexture {
    return this._depthTexture;
  }
  get colorTexture(): IGLTexture {
    return this._colorTexture;
  }

  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }

  private _frameBuffer: WebGLFramebuffer;
  private _colorTexture: IGLTexture;
  private _depthRenderBuffer: WebGLRenderbuffer;
  private _colorRenderBuffer: WebGLRenderbuffer;

  private _depthTexture: IGLTexture;
  private _previousViewport: Int32Array = null;

  // viewport state binding

  viewportBinded: () => void;
  viewportUnbinded: () => void;

  get glFrameBuffer(): WebGLFramebuffer{
    return this._frameBuffer;
    
  }

  constructor(
    gl: AnyWebRenderingGLContext,
    protected _width: number,
    protected _height: number,
    protected _useDepthTexture: boolean = false,
    protected _useColorTexture: boolean = true,
    protected _depthEnabled: boolean = false,
    // protected _useMipmap: boolean = false,
  ) {
    super(gl);
    this._frameBuffer = gl.createFramebuffer();

    if (_useColorTexture) {
      this._colorTexture = createEmptyTextureWithLinearFilter(gl,_width, _height);
      // this._colorTexture.setEmpty(gl.RGBA);
    } else {
      this._colorRenderBuffer = gl.createRenderbuffer();
    }

    if (_useDepthTexture) {
      GLSupport.depthTextureSupported(gl, true, true);
      this._depthTexture = createEmptyTextureWithLinearFilter(gl,_width, _height);
      // this._depthTexture.setEmpty(gl.RGBA);
    }

    if (!_useDepthTexture && _depthEnabled) {
      this._depthRenderBuffer = gl.createRenderbuffer();
    }

    this.viewportBinded = this.bind;
    this.viewportUnbinded = this.unbind;

    this.updateSettings();
  }

  updateSettings(): void {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    if (this._useColorTexture) {
      const colorTexture = this._colorTexture.texture;
      gl.bindTexture(gl.TEXTURE_2D, colorTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);

      gl.bindTexture(gl.TEXTURE_2D, null);
    } else {
      this.gl.bindRenderbuffer(gl.RENDERBUFFER, this._colorRenderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, this._width, this._height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this._depthRenderBuffer);
    }

    if (this._useDepthTexture) {
      const depthTexture = this._depthTexture.texture;

      gl.bindTexture(gl.TEXTURE_2D, depthTexture);

      // gl.texImage2D(
      //   gl.TEXTURE_2D,
      //   0,
      //   (gl as any).depthTextureExt !== undefined ? gl.DEPTH_COMPONENT : gl.DEPTH_COMPONENT16,
      //   this._width,
      //   this._height,
      //   0,
      //   gl.DEPTH_COMPONENT,
      //   gl.UNSIGNED_SHORT,
      //   null,
      // );

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        (gl as any).depthTextureExt !== undefined ? gl.DEPTH_COMPONENT : (gl as WebGL2RenderingContext).DEPTH_COMPONENT24,
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

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
      gl.bindTexture(gl.TEXTURE_2D, null);
    } else if (this._depthEnabled) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
    }

    // unbind
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    const gl = this.gl;

    if (this._colorTexture !== undefined) {
      this._colorTexture.safeBind((texture) =>  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null));
    }
    if (this._depthTexture !== undefined) {
      this._depthTexture.safeBind((texture) =>  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null));
    }

    this.updateSettings();
  }

  bind(): void {
    this._previousViewport = this.gl.getParameter(this.gl.VIEWPORT);
    this.gl.viewport(0, 0, this._width, this._height);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
  }

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

  destroy(destroyFramebuffer = true, destroyRenderBuffer = true, destroyTexture = true): void {
    if(destroyFramebuffer) this.gl.deleteFramebuffer(this._frameBuffer);
    if (this._useColorTexture && destroyTexture) this.gl.deleteTexture(this._colorTexture.texture);
    if (this._useDepthTexture && destroyTexture) this.gl.deleteTexture(this._depthTexture.texture);
   

    if (this._depthRenderBuffer !== undefined && destroyRenderBuffer) {
      this.gl.deleteRenderbuffer(this._depthRenderBuffer);
    }

    if (this._colorRenderBuffer !== undefined && destroyRenderBuffer) {
      this.gl.deleteRenderbuffer(this._colorRenderBuffer);
    }
  }
}
