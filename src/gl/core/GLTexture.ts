import { GLCore } from './GLCore';
import { AnyWebRenderingGLContext } from './GLHelpers';

export interface ImageSource {
  src: string;
  type?: GLenum;
}

const EXT_DEFAULT_ALPHA = ['png', 'gif'];

export class GLTexture extends GLCore {
  static async load(gl: AnyWebRenderingGLContext, url: string, type?: GLenum): Promise<GLTexture> {
    const finalType =
      type !== undefined
        ? type
        : EXT_DEFAULT_ALPHA.indexOf(url.split('.').pop().toLowerCase()) !== -1
          ? gl.RGBA
          : gl.RGB;

    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob))
      .then((image) => {
        const texture = new GLTexture(gl, gl.TEXTURE_2D, image.width, image.height);
        texture.uploadImage(image, finalType);
        return texture;
      });
  }

  get texture(): WebGLTexture {
    return this._texture;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  private _texture: WebGLTexture;

  constructor(
    gl: AnyWebRenderingGLContext,
    protected _textureType: GLenum,
    protected _width: number,
    protected _height: number,
    protected _mipmap: boolean = false,
    protected _linearFiltering: boolean = true,
    protected _wrapMode: GLenum = gl.CLAMP_TO_EDGE,
  ) {
    super(gl);

    this._texture = gl.createTexture();
    this.setup();
  }

  destroy(): void {
    this.gl.deleteTexture(this._texture);
  }

  setup(
    enableMimap: boolean = this._mipmap,
    linearFiltering: boolean = this._linearFiltering,
    wrapMode: GLenum = this._wrapMode,
  ): void {
    this.bind();
    if (enableMimap) {
      this.gl.texParameteri(
        this._textureType,
        this.gl.TEXTURE_MIN_FILTER,
        linearFiltering ? this.gl.NEAREST_MIPMAP_LINEAR : this.gl.NEAREST_MIPMAP_NEAREST,
      );
      this.gl.texParameteri(
        this._textureType,
        this.gl.TEXTURE_MAG_FILTER,
        linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
      );

      this.gl.generateMipmap(this._textureType);
    } else {
      this.gl.texParameteri(
        this._textureType,
        this.gl.TEXTURE_MIN_FILTER,
        linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
      );
      this.gl.texParameteri(
        this._textureType,
        this.gl.TEXTURE_MAG_FILTER,
        linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
      );
    }

    this.gl.texParameteri(this._textureType, this.gl.TEXTURE_WRAP_S, wrapMode);
    this.gl.texParameteri(this._textureType, this.gl.TEXTURE_WRAP_T, wrapMode);

    this.unbind();
  }

  setEmpty(format: GLenum, type: GLenum = this.gl.UNSIGNED_BYTE): void {
    this.gl.texImage2D(this._textureType, 0, format, format, type, null);
    if (this._mipmap) this.gl.generateMipmap(this._textureType);
  }

  resize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this.setEmpty(this.gl.RGBA);
  }

  uploadImage(
    image: HTMLImageElement | HTMLCanvasElement | ArrayBufferView | ImageData | ImageBitmap | HTMLVideoElement,
    format: GLenum,
    type: GLenum = this.gl.UNSIGNED_BYTE,
  ): void {
    this.bind();
    this.gl.texImage2D(this._textureType, 0, format, format, type, image as any);
    if (this._mipmap) this.gl.generateMipmap(this._textureType);
    this.unbind();
  }

  active(ind = 0): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + ind);
    this.bind();
  }

  bind(): void {
    this.gl.bindTexture(this._textureType, this.texture);
  }

  unbind(): void {
    this.gl.bindTexture(this._textureType, null);
  }
}
