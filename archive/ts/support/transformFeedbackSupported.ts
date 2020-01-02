import { AnyWebRenderingGLContext } from '../GLHelpers';
import { webGL2Supported } from "./webGL2Supported";
export function transformFeedbackSupported(gl: AnyWebRenderingGLContext, orFail = false) {
  if (webGL2Supported(gl)) {
    return true;
  }
  else if (orFail) {
    throw 'Transform feedback not supported in this context';
  }
  return false;
}
