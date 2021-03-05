import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { IGLTexture, IGLTextureBase } from '../../gl/core/GLTexture';


export function wrapTexture(gl: AnyWebRenderingGLContext, texture: WebGLTexture, target: GLenum): IGLTexture{

  return bindableTexture({
    gl,
    texture,
    target,
  })

}

export function bindableTexture<T extends IGLTextureBase = IGLTextureBase>(
  // gl: AnyWebRenderingGLContext,
  sourceTexture: T,
  // type: GLenum,

): T & {
  bind: () => void;
  unbind: () => void;
  active: (index?: number) => void;
  safeBind: (bindExec: (texture: IGLTexture) => void) => void;
} {


  const {gl, texture, target} = sourceTexture;
  const res = {
    ...sourceTexture,
    bind,
    unbind,
    active,
    safeBind,
  };

  function bind(): void {
    gl.bindTexture(target, texture);
  }

  function unbind(): void {
    gl.bindTexture(target, null);
  }

  function active(index = 0): void {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(target, texture);
  }
  
  

  function safeBind(bindExec: (texture: IGLTexture) => void){
    gl.bindTexture(target, texture);
    bindExec(res as any);
    gl.bindTexture(target, null);
  }


  return res as any;
 
}
