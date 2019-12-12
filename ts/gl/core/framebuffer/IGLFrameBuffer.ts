export interface IGLFrameBuffer {

    bind(): void;
    unbind(): void;

    width: number;
    height: number;
}
