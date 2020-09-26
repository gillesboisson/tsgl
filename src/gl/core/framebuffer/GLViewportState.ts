import { IGLFrameBuffer } from './IGLFrameBuffer';
import { AnyWebRenderingGLContext } from '../GLHelpers';

export interface GLViewportState {
  frameBuffer?: IGLFrameBuffer;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
  setGlState?: (gl: AnyWebRenderingGLContext) => void;
}

export class GLViewportStack {
  protected _stack: GLViewportState[] = [];

  constructor(protected _gl: AnyWebRenderingGLContext, protected _mainViewportState: GLViewportState) {}

  protected updateViewportState(state: GLViewportState): void {
    const gl = this._gl;
    const { frameBuffer, x, y, width, height, setGlState } = state;

    if (frameBuffer !== undefined) {
      if (width === undefined || height === undefined) {
        gl.viewport(x || 0, y || 0, frameBuffer.width, frameBuffer.height);
      }
      frameBuffer.bind();
    }

    if (width !== undefined && height !== undefined) {
      gl.viewport(x || 0, y || 0, width, height);
    }

    if (setGlState !== undefined) setGlState(gl);
  }

  reset(): void {
    this._stack.splice(0);
    this.updateViewportState(this._mainViewportState);
  }

  pushState(state: GLViewportState): void {
    this.updateViewportState(state);
    this._stack.push(state);
  }

  changeState(state: GLViewportState): void {
    if (this._stack.length === 0) throw new Error('changeState : Main viewport state can\'t be replaced');
    this.updateViewportState(state);
    this._stack[this._stack.length - 1] = state;
  }

  popState(): GLViewportState {
    if (this._stack.length === 0) {
      this.updateViewportState(this._mainViewportState);
      return this._mainViewportState;
    } else {
      const state = this._stack.pop();
      this.updateViewportState(state);
      return state;
    }
  }
}
