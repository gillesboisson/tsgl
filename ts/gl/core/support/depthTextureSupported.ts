import { AnyWebRenderingGLContext } from '../GLHelpers';
import { webGL2Supported } from "./webGL2Supported";
export function depthTextureSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false) {
  if (webGL2Supported(gl)) {
    return true;
  }
  else if (useExtension) {
    let ext = gl.getExtension('WEBGL_depth_texture');
    if (ext) {
      (<any>gl).depthTextureExt = ext;
      return true;
    }
  }
  if (orFail)
    throw 'Depth texture not supported';
  else
    return false;
}
