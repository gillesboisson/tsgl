import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLTexture } from '../gl/core/GLTexture';

export class CubeMapFramebuffer {
  private _framebufferTexture: GLTexture;
  private _framebuffer: WebGLFramebuffer;
  private _depthRenderBuffer: WebGLRenderbuffer;
  private __renderSize: (gl: AnyWebRenderingGLContext, sideIndex: number) => void;

  createCubemapTexture(
    gl: AnyWebRenderingGLContext,
    size: number,
    textureFormat = gl.RGBA,
  ): GLTexture {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        textureFormat,
        size,
        size,
        0,
        textureFormat,
        gl.UNSIGNED_BYTE,
        null,
      );
    }
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    return new GLTexture({ gl, texture }, gl.TEXTURE_CUBE_MAP);
  }

  constructor(
    readonly gl: AnyWebRenderingGLContext,
    protected _size: number,
    protected _textureFormat: GLenum = gl.RGBA,
  ) {
    this._framebufferTexture = this.createCubemapTexture(gl, _size, _textureFormat);
    this._framebuffer = gl.createFramebuffer();

    // create a depth render buffer and link it to framebuffer
    this._depthRenderBuffer = gl.createRenderbuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _size, _size);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.__renderSize = (gl: AnyWebRenderingGLContext, sideIndex: number) => this.renderSide(gl, sideIndex);
  }

  get framebufferTexture(): GLTexture {
    return this._framebufferTexture;
  }

  get framebuffer(): WebGLFramebuffer {
    return this._framebuffer;
  }

  get size(): number {
    return this._size;
  }

  resize(size: number, textureFormat = this._textureFormat): void {
    const gl = this.gl;
    this._size = size;
    this._textureFormat = textureFormat;

    // resize render buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    // resize texture
    const texture = this._framebufferTexture.texture;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    for (let i = 0; i < 6; i++) {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        this._textureFormat,
        size,
        size,
        0,
        this._textureFormat,
        gl.UNSIGNED_BYTE,
        null,
      );
    }
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderSide(gl: AnyWebRenderingGLContext, sideIndex: number): void {}

  render(sideRender: (gl: AnyWebRenderingGLContext, sideIndex: number) => void = this.__renderSize): void {
    const gl = this.gl;
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
    const texture = this._framebufferTexture.texture;
    gl.viewport(0, 0, this._size, this._size);

    for (let side = 0; side < 6; side++) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + side, texture, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      sideRender(gl, side);
    }

    this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
