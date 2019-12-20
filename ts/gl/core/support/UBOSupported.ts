import { AnyWebRenderingGLContext } from '../GLHelpers';
import { webGL2Supported } from "./webGL2Supported";
export function UBOSupported(gl: AnyWebRenderingGLContext, orFail = false) {
  let res = webGL2Supported(gl);
  if (!res && orFail)
    throw 'UBO not supported is this context WebGL2 required)';
  return res;
}
