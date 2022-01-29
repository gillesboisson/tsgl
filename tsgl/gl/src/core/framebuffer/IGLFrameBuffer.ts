export interface IGLFrameBuffer {
  bind(): void;
  unbind(): void;
  readonly framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
}
