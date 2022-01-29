import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IGLTexture } from './GLTexture';
import { bindableTexture } from './bindableTexture.1';

export function wrapTexture(gl: AnyWebRenderingGLContext, texture: WebGLTexture, target: GLenum): IGLTexture {
  return bindableTexture({
    gl,
    texture,
    target,
  });
}
