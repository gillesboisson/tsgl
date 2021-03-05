// import { GL1Enum } from '../../gl/core/GL1Enum';
// import { GL2Enum } from '../../gl/core/GL2Enum';
// import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';

// export interface IGLTextureBase<
//   ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
//   EnumT extends number = GLenum | GL2Enum
// > {
//   readonly texture: WebGLTexture;
//   readonly gl: ContextT;
//   readonly type: EnumT;
//   bind: () => void;
//   unbind: () => void;
// }

// export interface IGLTexture2D {
//   readonly type: GL1Enum.TEXTURE_2D;
// }

// export interface IGLTextureCubemap {
//   readonly type: GL1Enum.TEXTURE_CUBE_MAP;
// }

// export interface IGLTextureSized {
//   readonly width: number;
//   readonly height: number;
// }

// export interface IGLTextureMipmap {
//   readonly levels: number;
// }

// export function createGLTexture<
//   ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext,
//   EnumT extends number = GL2Enum | GL1Enum
// >(gl: ContextT, type: EnumT): IGLTextureBase<ContextT, EnumT> {
//   const texture = gl.createTexture();

//   function bind() {
//     gl.bindTexture(type, texture);
//   }

//   function unbind() {
//     gl.bindTexture(type, null);
//   }

//   return {
//     gl,
//     type,
//     texture,
//     bind,
//     unbind,
//   };
// }

// export function emptyMipmapTexture<ContextT extends AnyWebRenderingGLContext = AnyWebRenderingGLContext>(
//   sourceTexture: IGLTextureBase<ContextT, GL1Enum>,
//   width: number,
//   height: number,
//   levels: number,
// ): IGLTextureBase<ContextT, GL1Enum> & IGLTexture2D & IGLTextureSized & IGLTextureMipmap {
//   const { texture, gl, type } = sourceTexture;
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

//   gl.generateMipmap(gl.TEXTURE_2D);

//   return {
//     ...sourceTexture,
//     type: type as any,
//     width,
//     height,
//     levels,
//   };
// }
