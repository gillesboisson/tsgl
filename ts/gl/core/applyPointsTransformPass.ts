export function applyPointsTransformPass(
  gl: WebGL2RenderingContext,
  transformFeedback: WebGLTransformFeedback,
  vaoIn: WebGLVertexArrayObject,
  bufferOut: WebGLBuffer,
  nbPoints: number,
) {
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
  gl.bindVertexArray(vaoIn);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, bufferOut);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, nbPoints);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
  gl.disable(gl.RASTERIZER_DISCARD);
}
