import { AnyWebRenderingGLContext, WebGLRenderingContextWithVao } from './GLHelpers';

export class GLSupport {
  static VAOSupport(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false): WebGLRenderingContextWithVao {
    if ((gl as WebGL2RenderingContext).createVertexArray) {
      return gl as WebGLRenderingContextWithVao;
    } else if (useExtension) {
      const _vaoExt =
        gl.getExtension('OES_vertex_array_object') ||
        gl.getExtension('MOZ_OES_vertex_array_object') ||
        gl.getExtension('WEBKIT_OES_vertex_array_object');

      if (_vaoExt) {
        (gl as WebGLRenderingContextWithVao).createVertexArray = () => _vaoExt.createVertexArrayOES();
        (gl as WebGLRenderingContextWithVao).deleteVertexArray = (vao: WebGLVertexArrayObject) =>
          _vaoExt.deleteVertexArrayOES(vao);
        (gl as WebGLRenderingContextWithVao).bindVertexArray = (vao: WebGLVertexArrayObject) =>
          _vaoExt.bindVertexArrayOES(vao);
        return gl as WebGLRenderingContextWithVao;
      }
    }

    if (orFail) {
      throw new Error('Vao not supported');
    }

    return null;
  }

  static webGL2Supported(gl: WebGL2RenderingContext): boolean {
    return typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {boolean} useExtension
   * @param {boolean} orFail
   * @returns {boolean}
   */
  static depthTextureSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false): boolean {
    if (this.webGL2Supported(gl as WebGL2RenderingContext)) {
      return true;
    } else if (useExtension) {
      const ext = gl.getExtension('WEBGL_depth_texture');

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
    makeAngleExtPolyfill = true,
    orFail = false,
  ): boolean {
    if (GLSupport.webGL2Supported(gl as WebGL2RenderingContext)) return true;
    else if (makeAngleExtPolyfill) {
      if (!(gl as any).angleExt) {
        const ext = gl.getExtension('ANGLE_instanced_arrays');

        if (ext) {
          (gl as any).angleExt = ext;

          // map ext methods to context it was a webgl2 context
          (gl as WebGL2RenderingContext).vertexAttribDivisor = function (attrLocation, divisor) {
            return ext.vertexAttribDivisorANGLE(attrLocation, divisor);
          };

          (gl as WebGL2RenderingContext).drawElementsInstanced = function (mode, count, type, offset, primcount) {
            return ext.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
          };

          (gl as WebGL2RenderingContext).drawArraysInstanced = function (mode, first, count, primcount) {
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

  static MRTFrameBufferSupported(gl: AnyWebRenderingGLContext, useExtension = true, orFail = false): boolean {
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
