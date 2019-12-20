import { AnyWebRenderingGLContext } from '../GLHelpers';
import { webGL2Supported } from "./webGL2Supported";
export function MRTFrameBufferSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false) {
  if (webGL2Supported(gl))
    return true;
  else {
    let ext;
    if (useExtension)
      ext = (<any>gl).drawBuffersExt !== undefined ? (<any>gl).drawBuffersExt : gl.getExtension('WEBGL_draw_buffers');
    if (!ext) {
      if (orFail)
        throw 'MRT not supported for this context';
      // else
      //   console.warn("MRTFrameBuffer","MRT not supported for this context");
      return false;
    }
    else {
      (<any>gl).drawBuffersExt = ext;
      return true;
    }
  }
}
