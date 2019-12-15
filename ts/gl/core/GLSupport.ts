import { AnyWebRenderingGLContext } from './GLHelpers';

export class GLSupport {
  static webGL2Supported(gl: WebGL2RenderingContext) {
    return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {boolean} useExtension
   * @param {boolean} orFail
   * @returns {boolean}
   */
  static depthTextureSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false) {
    if (this.webGL2Supported(gl as WebGL2RenderingContext)) {
      return true;
    } else if (useExtension) {
      let ext = gl.getExtension('WEBGL_depth_texture');

      if (ext) {
        (gl as any).depthTextureExt = ext;
        return true;
      }
    } else if (orFail) {
      throw new Error('Depth texture is required and not supported');
    }
  }

  static instanceRenderingSupported(
    gl: AnyWebRenderingGLContext,
    makeAngleExtPolyfill: boolean = true,
    orFail: boolean = false,
  ): boolean {
    if (GLSupport.webGL2Supported(gl as WebGL2RenderingContext)) return true;
    else if (makeAngleExtPolyfill) {
      if (!(gl as any).angleExt) {
        const ext = gl.getExtension('ANGLE_instanced_arrays');

        if (ext) {
          (gl as any).angleExt = ext;

          // map ext methods to context it was a webgl2 context
          (gl as WebGL2RenderingContext).vertexAttribDivisor = function(attrLocation, divisor) {
            return ext.vertexAttribDivisorANGLE(attrLocation, divisor);
          };

          (gl as WebGL2RenderingContext).drawElementsInstanced = function(mode, count, type, offset, primcount) {
            return ext.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
          };

          (gl as WebGL2RenderingContext).drawArraysInstanced = function(mode, first, count, primcount) {
            return ext.drawArraysInstancedANGLE(mode, first, count, primcount);
          };
        }

        return ext !== null && ext !== undefined;
      } else return true;
    } else if (orFail) {
      throw 'Instanced Geometry not supported on this context';
    }

    return false;
  }

  static MRTFrameBufferSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false) {
    if (this.webGL2Supported(gl as WebGL2RenderingContext)) return true;
    else {
      let ext;
      if (useExtension)
        ext =
          (gl as any).drawBuffersExt !== undefined ? (gl as any).drawBuffersExt : gl.getExtension('WEBGL_draw_buffers');

      if (!ext) {
        if (orFail) throw 'MRT not supported for this context';
        return false;
      } else {
        (gl as any).drawBuffersExt = ext;

        return true;
      }
    }
  }
}
