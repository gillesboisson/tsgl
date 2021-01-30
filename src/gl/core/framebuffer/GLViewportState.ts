import { IGLFrameBuffer } from './IGLFrameBuffer';
import { AnyWebRenderingGLContext } from '../GLHelpers';

export interface GLViewportState {
  frameBuffer?: IGLFrameBuffer;

  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // setGlState?: (gl: AnyWebRenderingGLContext) => void;
  viewportBinded?: (gl: AnyWebRenderingGLContext) => void;
  viewportUnbinded?: (gl: AnyWebRenderingGLContext) => void;
}

export class GLViewportStack {
  protected _stack: GLViewportState[] = [];

  protected _currentState: GLViewportState;

  get currentState(): GLViewportState {
    return this._currentState;
  }

  constructor(protected _gl: AnyWebRenderingGLContext, protected _mainViewportState: GLViewportState) {
    this._currentState = _mainViewportState;
  }

  protected changeCurrentState(state: GLViewportState, unbindPreviousState = true): void {
    const gl = this._gl;
    const { frameBuffer, x, y, width, height } = state;

    if (unbindPreviousState && this._currentState.viewportUnbinded !== undefined)
      this._currentState.viewportUnbinded(this._gl);
    this._currentState = state;

    if (frameBuffer !== undefined) {
      if (width === undefined || height === undefined) {
        gl.viewport(x || 0, y || 0, frameBuffer.width, frameBuffer.height);
      }
      frameBuffer.bind();
    }

    if (width !== undefined && height !== undefined) {
      gl.viewport(x || 0, y || 0, width, height);
    }

    if (state.viewportBinded !== undefined) state.viewportBinded(gl);
  }

  reset(): void {
    this._stack.forEach((s) => {
      if (s.viewportUnbinded !== undefined) s.viewportUnbinded(this._gl);
    });
    this._stack.splice(0);
    this.changeCurrentState(this._mainViewportState, false);
  }

  pushState(state: GLViewportState): void {
    this.changeCurrentState(state);
    this._stack.push(state);
  }

  changeState(state: GLViewportState): void {
    if (this._stack.length === 0) throw new Error("changeState : Main viewport state can't be replaced");
    this.changeCurrentState(state);
    this._stack[this._stack.length - 1] = state;
  }

  popState(): GLViewportState {
    if (this._stack.length === 0) {
      this.changeCurrentState(this._mainViewportState);
      return this._mainViewportState;
    } else {
      const state = this._stack.pop();
      this.changeCurrentState(state);
      return state;
    }
  }
}
