import { createPlaneMesh } from '../tsgl/geom/mesh/createPlaneMesh';
import { IGLFrameBuffer } from '../tsgl/gl/core/framebuffer/IGLFrameBuffer';
import { GLCore } from '../tsgl/gl/core/GLCore';
import { GLSupport } from '../tsgl/gl/core/GLSupport';
import { GLTexture2D, IGLTexture } from '../tsgl/gl/core/texture/GLTexture';
import { createEmptyTextureWithLinearFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearFilter';
import { createEmptyTextureWithLinearNearestFilter } from '../tsgl/helpers/texture/createEmptyTextureWithLinearNearestFilter';

export interface DeferredFrameBufferOptions {
  width: number;
  height: number;
  useDepthTexture?: boolean;
  depthEnabled?: boolean;
  pbrEnabled?: boolean;
  emissiveEnabled?: boolean;
}

export interface DeferredFrameBufferSettings extends DeferredFrameBufferOptions {
  useDepthTexture: boolean;
  depthEnabled: boolean;
  pbrEnabled: boolean;
  emissiveEnabled: boolean;
}

function deferredFrameBufferDefaultSettings(options: DeferredFrameBufferOptions): DeferredFrameBufferSettings {
  return {
    ...options,
    useDepthTexture: options.useDepthTexture !== undefined ? options.useDepthTexture : false,
    depthEnabled: options.depthEnabled !== undefined ? options.depthEnabled : true,
    pbrEnabled: options.pbrEnabled !== undefined ? options.pbrEnabled : false,
    emissiveEnabled: options.emissiveEnabled !== undefined ? options.emissiveEnabled : false,
  };
}

export class DeferredFrameBuffer extends GLCore implements IGLFrameBuffer {
  private _positionMap: GLTexture2D;
  private _normalMap: GLTexture2D;
  private _albedo: GLTexture2D;
  readonly pbrEnabled: boolean;
  private _pbrMap: GLTexture2D;
  readonly emissiveEnabled: boolean;
  private _emissiveMap: GLTexture2D;

  get albedo(): GLTexture2D {
    return this._albedo;
  }

  get normalMap(): GLTexture2D {
    return this._normalMap;
  }

  get positionMap(): GLTexture2D {
    return this._positionMap;
  }

  get pbrMap(): GLTexture2D {
    return this._pbrMap;
  }
  get emissiveMap(): GLTexture2D {
    return this._emissiveMap;
  }

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


  get frameBuffer():WebGLFramebuffer{
    return this._frameBuffer;
  }
  


  get textures(): IGLTexture[] {
    return this._textures;
  }

  get depthTexture(): IGLTexture {
    return this._depthTexture;
  }

  protected _width: number;
  protected _height: number;
  protected _useDepthTexture: boolean;
  protected _depthEnabled: boolean;

  constructor(gl: WebGL2RenderingContext, options: DeferredFrameBufferOptions) {
    super(gl);
    const {
      width,
      height,
      useDepthTexture,
      depthEnabled,
      pbrEnabled,
      emissiveEnabled,
    } = deferredFrameBufferDefaultSettings(options);

    this._width = width;
    this._height = height;
    this._useDepthTexture = useDepthTexture;
    this._depthEnabled = depthEnabled;
    this.pbrEnabled = pbrEnabled;
    this.emissiveEnabled = emissiveEnabled;

    GLSupport.MRTFrameBufferSupported(gl, true, true);

    if (useDepthTexture) {
      GLSupport.depthTextureSupported(gl, true, true);
    }

    this._isWebGL2 = GLSupport.webGL2Supported(gl as WebGL2RenderingContext);

    if (!this._isWebGL2) {
      throw new Error('Deferred framebuffer require Webgl rendering Context');
    }

    const ext = gl.getExtension('EXT_color_buffer_float');

    if (!ext) {
      throw new Error(
        'EXT_color_buffer_float not available but Deferred framebuffer require it for high precision position / normal Gbuffer',
      );
    }

    this._frameBuffer = gl.createFramebuffer();

    this._textures = [];

    // create rendering layers

    this._positionMap = createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT);
    this._normalMap = createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT);
    this._albedo = createEmptyTextureWithLinearFilter(gl, width, height);

    this._textures.push(this._albedo, this._positionMap, this._normalMap);

    if (pbrEnabled) {
      this._pbrMap = createEmptyTextureWithLinearFilter(gl, width, height);
      this._textures.push(this._pbrMap);
    }
    if (emissiveEnabled) {
      this._emissiveMap = createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT);
      this._textures.push(this._emissiveMap);
    }

    if (useDepthTexture) {
      this._depthTexture = createEmptyTextureWithLinearFilter(gl, width, height, gl.RGBA);
    } else if (this._depthEnabled) {
      this._depthRenderBuffer = gl.createRenderbuffer();
    }

    this.updateSettings();
  }

  updateSettings(): void {
    const gl = this.gl as WebGL2RenderingContext;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    this._colorsAttachements = new Array(this._textures.length);

    // setup color textures
    if (this._isWebGL2) {
      // WEBGL 2 MRT
      const gl2 = gl as WebGL2RenderingContext;

      for (let i = 0; i < this._textures.length; i++) {
        this._colorsAttachements[i] = gl2.COLOR_ATTACHMENT0 + i;

        gl.bindTexture(gl.TEXTURE_2D, this._textures[i].texture);
        gl.framebufferTexture2D(
          gl2.DRAW_FRAMEBUFFER,
          gl2.COLOR_ATTACHMENT0 + i,
          gl.TEXTURE_2D,
          this._textures[i].texture,
          0,
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    }

    // setup depth texture
    if (this._useDepthTexture) {


      gl.bindTexture(this.gl.TEXTURE_2D, this._depthTexture.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.DEPTH_COMPONENT24,
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

  // resize(width: number, height: number): void {
  //   this._width = width;
  //   this._height = height;
  //   const gl = this.gl;

    

  //   for (const t of this._textures) {
  //     t.safeBind((t) => this.gl.texImage2D(t.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, null));
  //   }

  //   this._depthTexture.safeBind((t) => this.gl.texImage2D(t.target, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null));

  //   this.updateSettings();
  // }

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
