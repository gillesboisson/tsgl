import { IGLCore } from '../IGLCore';
import { GLBuffer } from './GLBuffer';

export class GLUbo implements IGLCore {
  protected _uboIndex: number;

  constructor(readonly gl: WebGL2RenderingContext, id: string | number, program?: WebGLProgram) {
    if (typeof id === 'string') {
      if (program === undefined) throw new Error('When id is provided as string in UBO, a program is required');
      this._uboIndex = gl.getUniformBlockIndex(program, id);
    } else {
      this._uboIndex = id;
    }
  }

  bindBufferRange(buffer: GLBuffer, offset: number, size: number): void {
    const gl = this.gl;
    gl.bindBufferRange(gl.UNIFORM_BUFFER, this._uboIndex, buffer.bufferIndex, offset, size);
  }

  bindBufferBase(buffer: GLBuffer): void {
    const gl = this.gl;
    gl.bindBufferBase(gl.UNIFORM_BUFFER, this._uboIndex, buffer.bufferIndex);
  }

  get uboIndex(): number {
    return this._uboIndex;
  }

  destroy(): void {}
}
