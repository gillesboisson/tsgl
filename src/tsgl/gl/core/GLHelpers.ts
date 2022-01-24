export type AnyWebRenderingGLContext = WebGLRenderingContext | WebGL2RenderingContext;

export type WebGLRenderingContextWithVao = AnyWebRenderingGLContext & {
  createVertexArray(): WebGLVertexArrayObject | null;
  deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void;
  bindVertexArray(array: WebGLVertexArrayObject | null): void;
};
