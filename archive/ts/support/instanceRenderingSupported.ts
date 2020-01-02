import { webGL2Supported } from "./webGL2Supported";
export function instanceRenderingSupported(gl: WebGL2RenderingContext, makeAngleExtPolyfill = true, orFail = false) {
  const _gl = gl as any;
  if (webGL2Supported(gl))
    return true;
  else if (makeAngleExtPolyfill) {
    if (!_gl.angleExt) {
      const ext = gl.getExtension('ANGLE_instanced_arrays');
      if (ext) {
        _gl.angleExt = ext;
        gl.vertexAttribDivisor = function (attrLocation: number, divisor: number) {
          return ext.vertexAttribDivisorANGLE(attrLocation, divisor);
        };
        gl.drawElementsInstanced = function (mode: number, count: number, type: number, offset: number, primcount: number) {
          return ext.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
        };
        gl.drawArraysInstanced = function (mode: number, first: number, count: number, primcount: number) {
          return ext.drawArraysInstancedANGLE(mode, first, count, primcount);
        };
      }
      return ext !== null && ext !== undefined;
    }
    else
      return true;
  }
  else if (orFail) {
    throw 'Instanced Geometry not supported on this context';
  }
  return false;
}
