import { IGLTexture, IGLTextureBase } from './GLTexture';



export function bindableTexture<T extends IGLTextureBase = IGLTextureBase>(
  // gl: AnyWebRenderingGLContext,
  sourceTexture: T,
): T & {
  bind: () => void;
  unbind: () => void;
  active: (index?: number) => void;
  activeSafe: (index?: number) => void;
  safeBind: (bindExec: (texture: IGLTexture) => void) => void;
} {
  const { gl, texture, target } = sourceTexture;
  const res = {
    ...sourceTexture,
    bind,
    unbind,
    active,
    safeBind,
    activeSafe,
    
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
  function activeSafe(index = 0): void {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(target, texture);
    gl.activeTexture(gl.TEXTURE0);
  }

  function safeBind(bindExec: (texture: IGLTexture) => void) {
    gl.bindTexture(target, texture);
    bindExec(res as any);
    gl.bindTexture(target, null);
  }

  return res as any;
}
