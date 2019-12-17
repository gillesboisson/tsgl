import { IGLCore } from '../IGLCore';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLBuffer } from './GLBuffer';

export class GLUbo implements IGLCore {
  protected _uboIndex: number;

  constructor(
    protected _gl: WebGL2RenderingContext,
    program: WebGLProgram,
    uniformBlockIndex: string | number,
    uniformBlockBinding: number,
  ) {
    _gl.useProgram(program);
    this._uboIndex =
      typeof uniformBlockIndex === 'number' ? uniformBlockIndex : _gl.getUniformBlockIndex(program, uniformBlockIndex);
    _gl.uniformBlockBinding(program, this._uboIndex, uniformBlockBinding);
    _gl.useProgram(null);
  }

  bindBufferRange(buffer: GLBuffer, offset: number, size: number) {
    const gl = this._gl;
    gl.bindBufferRange(gl.UNIFORM_BUFFER, this._uboIndex, buffer.bufferIndex, offset, size);
  }

  bindBufferBase(buffer: GLBuffer) {
    const gl = this._gl;
    gl.bindBufferBase(gl.UNIFORM_BUFFER, this._uboIndex, buffer.bufferIndex);
  }

  get uboIndex() {
    return this._uboIndex;
  }

  getGL(): AnyWebRenderingGLContext {
    return this._gl;
  }
  destroy(): void {}
}
