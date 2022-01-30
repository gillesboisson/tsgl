import { IResize } from '@tsgl/core';
import { createPlaneMesh, resizableTexture } from '@tsgl/gl';
import { createEmptyTextureWithLinearFilter, createEmptyTextureWithLinearNearestFilter } from '@tsgl/gl';
import { IGLFrameBuffer } from '@tsgl/gl';
import { GLCore } from '@tsgl/gl';
import { GLSupport } from '@tsgl/gl';
import { GLTexture2D, IGLTexture } from '@tsgl/gl';

export interface DeferredFrameBufferOptions {
  width: number;
  height: number;
  useDepthTexture?: boolean;
  depthEnabled?: boolean;
  pbrEnabled?: boolean;
  emissiveEnabled?: boolean;
}

export type DeferredFrameBufferSettings = Required<DeferredFrameBufferOptions>;


function deferredFrameBufferDefaultSettings(options: DeferredFrameBufferOptions): DeferredFrameBufferSettings {
  return {
    ...options,
    useDepthTexture: options.useDepthTexture !== undefined ? options.useDepthTexture : false,
    depthEnabled: options.depthEnabled !== undefined ? options.depthEnabled : true,
    pbrEnabled: options.pbrEnabled !== undefined ? options.pbrEnabled : false,
    emissiveEnabled: options.emissiveEnabled !== undefined ? options.emissiveEnabled : false,
  };
}

export class DeferredFrameBuffer extends GLCore implements IGLFrameBuffer, IResize {
  private _positionMap: IResize & GLTexture2D;
  private _normalMap: IResize & GLTexture2D;
  private _albedo: IResize & GLTexture2D;
  private _pbrEnabled: boolean;
  private _pbrMap: IResize & GLTexture2D;
  readonly emissiveEnabled: boolean;
  private _emissiveMap: IResize & GLTexture2D;

  get albedo(): GLTexture2D {
    return this._albedo;
  }

  get normalMap(): GLTexture2D {
    return this._normalMap;
  }

  get pbrEnabled(){
    return this._pbrEnabled;
  }

  
  set pbrEnabled(val :boolean){
    if(this._pbrEnabled !== val){
      this._pbrEnabled = val;
      this._updatePbrSettings()
    }
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
  private _textures: Array<IGLTexture & IResize>;
  private _depthTexture?: IResize & GLTexture2D;
  private _depthRenderBuffer: WebGLFramebuffer;
  private _colorsAttachements: GLenum[];
  private _previousViewport: Int32Array = null;


  get framebuffer():WebGLFramebuffer{
    return this._frameBuffer;
  }
  


  get textures(): IGLTexture[] {
    return this._textures;
  }

  get depthTexture(): GLTexture2D {
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
    this._pbrEnabled = pbrEnabled;
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

    this._positionMap = resizableTexture(createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT));
    this._normalMap = resizableTexture(createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT));
    this._albedo = resizableTexture(createEmptyTextureWithLinearFilter(gl, width, height));

    this._textures.push(this._albedo, this._positionMap, this._normalMap);

    this._updatePbrSettings(width, height, false);

    if (emissiveEnabled) {
      this._emissiveMap = resizableTexture(createEmptyTextureWithLinearNearestFilter(gl, width, height, gl.RGBA16F, gl.RGBA, gl.FLOAT));
      this._textures.push(this._emissiveMap);
    }

    if (useDepthTexture) {
      this._depthTexture = resizableTexture(createEmptyTextureWithLinearFilter(gl, width, height, gl.RGBA));
    } else if (this._depthEnabled) {
      this._depthRenderBuffer = gl.createRenderbuffer();
    }

    this.updateSettings();
  }
  private _updatePbrSettings(width = this.width, height = this.height, updateSettings = true) {
    if (this._pbrEnabled) {
      this._pbrMap = resizableTexture(createEmptyTextureWithLinearFilter(this.gl, width, height));
      this._textures.push(this._pbrMap);
    }else if(this._pbrMap){
      const ind = this._textures.indexOf(this._pbrMap);
      if(ind !== -1){
        this._textures.splice(ind,1);
      }
      this._pbrMap = undefined;
    }
    if(updateSettings){
      this.updateSettings();
    }
  }

  resize(width: number, height: number): void {
    throw new Error('Not implemented')
    // for (let i = 0; i < this._textures.length; i++) {
    //   this._textures[i].resize(width, height);
    // }
    
    // this._depthTexture?.resize(width, height);

    // this._width = width;
    // this._height = height;

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

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthTexture.texture, 0);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // setup depth render buffer
    if (this._depthRenderBuffer !== undefined) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, this._width, this._height);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bind(): void {



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
