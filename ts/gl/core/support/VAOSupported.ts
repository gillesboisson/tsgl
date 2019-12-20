import { webGL2Supported } from "./webGL2Supported";
export function VAOSupported(gl: WebGL2RenderingContext, useExtension = true, orFail = false) {
  if (webGL2Supported(gl))
    return true;
  else {
    let ext;
    if (useExtension)
      ext =
        gl.getExtension('OES_vertex_array_object') ||
        gl.getExtension('MOZ_OES_vertex_array_object') ||
        gl.getExtension('WEBKIT_OES_vertex_array_object');
    if (!ext) {
      if (orFail)
        throw 'VAO not supported for this context';
      // else
      //   console.warn("VAO not supported for this context");
      return false;
    }
    else
      return true;
  }
}
