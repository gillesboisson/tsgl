import { IGLCore } from '../IGLCore';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLBuffer } from './GLBuffer';

export class GLUbo implements IGLCore {
  protected _uboIndex: number;

  constructor(protected _gl: WebGL2RenderingContext, id: string | number, program?: WebGLProgram) {
    if (typeof id === 'string') {
      if (program === undefined) throw new Error('When id is provided as string in UBO, a program is required');
      this._uboIndex = _gl.getUniformBlockIndex(program, id);
    } else {
      this._uboIndex = id;
    }
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
