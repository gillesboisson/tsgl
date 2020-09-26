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
        : EXT_DEFAULT_ALPHA.indexOf(
            url
              .split('.')
              .pop()
              .toLowerCase(),
          ) !== -1
        ? gl.RGBA
        : gl.RGB;

    // return new Promise(function(resolve, reject) {

    //   const img = new Image();
    //   img.onload = (e) => {
    //     const texture = new GLTexture(gl, gl.TEXTURE_2D, img.width, img.height);
    //     texture.uploadImage(img, finalType);
    //     resolve(texture);
    //   };

    //   img.onerror = (event, src, li, le, error) => reject({ event, src, error });

    //   img.src = url;
    // });

    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob))
      .then((image) => {
        const texture = new GLTexture(gl, gl.TEXTURE_2D, image.width, image.height);
        texture.uploadImage(image, finalType);
        return texture;
      });
  }

  // static async loadMany(gl: AnyWebRenderingGLContext,imageSources: ImageSource[],parallelLoads = 3){

  //   let loadInd;

  //   for()

  //   for(let imageSource of imageSources){
  //     if(imageSource.type === undefined){
  //       const imgExt = imageSource.src.split('.').pop().toLowerCase();
  //       imageSource.type = EXT_DEFAULT_ALPHA.indexOf(imgExt) === -1 ? gl.RGB : gl.RGBA;

  //     }

  //   }
  // }

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
  ) {
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

  setEmpty(format: GLenum, type: GLenum = this.gl.UNSIGNED_BYTE) {
    this.gl.texImage2D(this._textureType, 0, format, format, type, null);
    if (this._mipmap) this.gl.generateMipmap(this._textureType);
  }

  resize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.setEmpty(this.gl.RGBA);
  }

  uploadImage(
    image: HTMLImageElement | HTMLCanvasElement | ArrayBufferView | ImageData | ImageBitmap | HTMLVideoElement,
    format: GLenum,
    type: GLenum = this.gl.UNSIGNED_BYTE,
  ) {
    this.bind();
    this.gl.texImage2D(this._textureType, 0, format, format, type, image as any);
    if (this._mipmap) this.gl.generateMipmap(this._textureType);
    this.unbind();
  }

  active(ind: number = 0) {
    this.gl.activeTexture(this.gl.TEXTURE0 + ind);
    this.bind();
  }

  bind() {
    this.gl.bindTexture(this._textureType, this.texture);
  }

  unbind() {
    this.gl.bindTexture(this._textureType, null);
  }
}
