// import { GL1Enum } from './GL1Enum';
// import { GL2Enum } from './GL2Enum';
// import { GLCore, GLType } from './GLCore';
import { AnyWebRenderingGLContext } from '../GLHelpers';

export interface ImageSource {
  src: string;
  type?: GLenum;
}

export interface IGLLodTexture {
  levels: number;
}
export interface IGLTextureBase<
  ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext
> {
  gl: ContextT;
  target: GLenum;
  readonly texture: WebGLTexture;
}



export interface IGLStoredTextureBase {
  type?: GLenum;
  format?: GLenum;
  internalFormat: GLenum;
  mipmap?: boolean;
}


export interface IGLTexture2DBase {
  width: number;
  height: number;
}

export interface IGLTextureLodBase {
  levels: number,
}

export interface IGLTextureLevelBase{
  level: number;
}

export type GLTexture2DBase<
ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext
> = IGLTextureBase<ContextT> & IGLTexture2DBase & IGLStoredTextureBase & IGLTexture2DBase

export type GLTexture2D<
ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext
>  = IGLTexture<ContextT> & IGLStoredTextureBase & IGLTexture2DBase;


export type GLTextureCubemap<
ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext
>  = IGLTexture<ContextT> & IGLStoredTextureBase & {size: number};


export interface IGLTextureCubemapSize {
  size: number;
}

export interface IGLTexture<
ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext
> extends IGLTextureBase<ContextT> {
  bind: () => void;
  unbind: () => void;
  active: (index?: number) => void;
  safeBind: (bindExec: (texture: IGLTexture) => void) => void;
  activeSafe: (index?: number) => void;
  
}

// const EXT_DEFAULT_ALPHA = ['png', 'gif'];

// type TextureCompatibleImage =
//   | HTMLImageElement
//   | HTMLCanvasElement
//   | ArrayBufferView
//   | ImageData
//   | ImageBitmap
//   | HTMLVideoElement;
// export class GLTexture extends GLCore implements IGLTexture {
//   static async loadTexture2D(gl: AnyWebRenderingGLContext, url: string, type?: GLenum): Promise<GLTexture> {
//     const finalType =
//       type !== undefined
//         ? type
//         : EXT_DEFAULT_ALPHA.indexOf(url.split('.').pop().toLowerCase()) !== -1
//         ? gl.RGBA
//         : gl.RGB;

//     return fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => createImageBitmap(blob))
//       .then((image) => {
//         const texture = new GLTexture(gl, gl.TEXTURE_2D, image.width, image.height);
//         texture.uploadImage(image, finalType);
//         return texture;
//       });
//   }

//   // image order  posx.*, negx.*, posy.*, negy.*, posz.* and negz.*
//   static async loadCubeMap(gl: AnyWebRenderingGLContext, urls: string[], format?: GLenum) {
//     if (urls.length !== 6) throw new Error('6 images URL has to be provided in order to load 6 cube map faces');
//     const texture = new GLTexture(gl, gl.TEXTURE_CUBE_MAP);
//     const textureGL = texture.texture;

//     const finalFormat: number =
//       format !== undefined
//         ? format
//         : EXT_DEFAULT_ALPHA.indexOf(urls[0].split('.').pop().toLowerCase()) !== -1
//         ? gl.RGBA
//         : gl.RGB;

//     return Promise.all(
//       urls.map((url, ind) =>
//         fetch(url)
//           .then((response) => response.blob())
//           .then((blob) => createImageBitmap(blob))
//           .then((image) => {
//             gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureGL);
//             gl.texImage2D(
//               gl.TEXTURE_CUBE_MAP_POSITIVE_X + ind,
//               0,
//               finalFormat,
//               finalFormat,
//               gl.UNSIGNED_BYTE,
//               image as any,
//             );
//             gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
//             return image;
//           }),
//       ),
//     )
//       .then((images) => texture)
//       .catch((err) => {
//         texture.destroy();
//         throw err;
//       });
//   }
//   safeBind(bindExec: (texture: IGLTexture) => void ): void{

//   }
//   glType = GLType.Texture;

//   get target(): number{
//     return this._textureTarget;
//   }

//   get texture(): WebGLTexture {
//     return this._texture;
//   }

//   get width(): number {
//     return this._width;
//   }

//   get height(): number {
//     return this._height;
//   }

//   constructor(
//     context: AnyWebRenderingGLContext | { gl: AnyWebRenderingGLContext; texture: WebGLTexture },
//     protected _textureTarget: GLenum,
//     protected _width?: number,
//     protected _height?: number,
//     protected _mipmap: boolean = false,
//     protected _linearFiltering: boolean = true,
//     protected _wrapMode: GLenum = (context as any).CLAMP_TO_EDGE || (context as any).gl.CLAMP_TO_EDGE,
//   ) {
//     super((context as any).gl ? (context as any).gl : (context as AnyWebRenderingGLContext));

//     // this._wrapMode = wrapMode | ((gl as any).gl ? )
//     if ((context as any).gl) {
//       this._texture = (context as any).texture;
//     } else {
//       this._texture = (context as AnyWebRenderingGLContext).createTexture();
//       this.setup();
//     }
//   }

//   destroy(): void {
//     this.gl.deleteTexture(this._texture);
//   }

//   setup(
//     enableMimap: boolean = this._mipmap,
//     linearFiltering: boolean = this._linearFiltering,
//     wrapMode: GLenum = this._wrapMode,
//   ): void {
//     this.bind();
//     if (enableMimap) {
//       this.gl.texParameteri(
//         this._textureTarget,
//         this.gl.TEXTURE_MIN_FILTER,
//         linearFiltering ? this.gl.NEAREST_MIPMAP_LINEAR : this.gl.NEAREST_MIPMAP_NEAREST,
//       );
//       this.gl.texParameteri(
//         this._textureTarget,
//         this.gl.TEXTURE_MAG_FILTER,
//         linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
//       );

//       this.gl.generateMipmap(this._textureTarget);
//     } else {
//       this.gl.texParameteri(
//         this._textureTarget,
//         this.gl.TEXTURE_MIN_FILTER,
//         linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
//       );
//       this.gl.texParameteri(
//         this._textureTarget,
//         this.gl.TEXTURE_MAG_FILTER,
//         linearFiltering ? this.gl.LINEAR : this.gl.NEAREST,
//       );
//     }

//     this.gl.texParameteri(this._textureTarget, this.gl.TEXTURE_WRAP_S, wrapMode);
//     this.gl.texParameteri(this._textureTarget, this.gl.TEXTURE_WRAP_T, wrapMode);

//     this.unbind();
//   }

//   setEmpty(format: GLenum, type: GLenum = this.gl.UNSIGNED_BYTE): void {
//     this.gl.texImage2D(this._textureTarget, 0, format, format, type, null);
//     if (this._mipmap) this.gl.generateMipmap(this._textureTarget);
//   }

//   /**
//    *
//    * @param width texture width
//    * @param height texture height
//    * @param setEmpty update WebGLTexture size by emptying : default is true can be set to false if WebGLTexture properties is handled manually
//    */
//   resize(width: number, height: number, setEmpty = true): void {
//     this._width = width;
//     this._height = height;
//     if (setEmpty) this.setEmpty(this.gl.RGBA);
//   }

//   uploadImage(image: TextureCompatibleImage, format: GLenum, type: GLenum = this.gl.UNSIGNED_BYTE): void {
//     this.bind();
//     this.gl.texImage2D(this._textureTarget, 0, format, format, type, image as any);
//     if (this._mipmap) this.gl.generateMipmap(this._textureTarget);
//     this.unbind();
//   }

//   // image order  posx.*, negx.*, posy.*, negy.*, posz.* and negz.*
//   uploadCubemap(images: TextureCompatibleImage[], format: GLenum, type: GLenum = this.gl.UNSIGNED_BYTE): void {
//     this.bind();
//     images.forEach((image: TextureCompatibleImage, ind: number) => {
//       this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + ind, 0, format, format, type, image as any);
//     });
//     if (this._mipmap) this.gl.generateMipmap(this._textureTarget);
//     this.unbind();
//   }

//   active(ind = 0): void {
//     this.gl.activeTexture(this.gl.TEXTURE0 + ind);
//     this.bind();
//   }

//   bind(): void {
//     this.gl.bindTexture(this._textureTarget, this._texture);
//   }

//   unbind(): void {
//     this.gl.bindTexture(this._textureTarget, null);
//   }

//   private _texture: WebGLTexture;
// }
