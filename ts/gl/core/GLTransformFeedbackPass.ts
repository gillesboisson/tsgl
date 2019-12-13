import { GLCore } from './GLCore';
import { GLVao } from './data/GLVao';
import { GLBuffer } from './data/GLBuffer';
import { GLTransformFeedbackShader, GLTransformFeedbackShaderState } from './data/GLTFShader';
import { applyPointsTransformPass } from './applyPointsTransformPass';
import { InterleaveGLDataType } from '../data/InterleaveGLDataType';
import { IInterleaveData } from '../data/IInterleaveData';

export class GLTransformFeedbackPass<DataT extends IInterleaveData> extends GLCore {
  protected _buffer1Ind: WebGLBuffer;
  protected _buffer2Ind: WebGLBuffer;
  protected _vao1: GLVao;
  protected _vao2: GLVao;
  protected __destroyBuffer1: boolean;
  protected __destroyBuffer2: boolean;
  protected _buffer1: GLBuffer;
  protected _buffer2: GLBuffer;
  protected _bufferSwapped: boolean;
  protected _transformFeedback: WebGLTransformFeedback;

  constructor(
    gl: WebGL2RenderingContext,
    protected _interleavedDataType: InterleaveGLDataType<DataT>,
    protected _length: number,
    protected _type: GLenum = gl.TRANSFORM_FEEDBACK,
    protected _drawType: GLenum = gl.STREAM_DRAW,
    _buffer1?: GLBuffer,
    _buffer2?: GLBuffer,
  ) {
    super(gl);
    this._transformFeedback = gl.createTransformFeedback();
    this.__destroyBuffer1 = _buffer1 === undefined;
    this.__destroyBuffer2 = _buffer1 === undefined;
    const stride = _interleavedDataType.__byteLength;
    if (_buffer1 === undefined) {
      this._buffer1 = new GLBuffer(gl, gl.ARRAY_BUFFER, _drawType);
      this._buffer1.bufferDataLength(_length * stride);
    } else {
      this._buffer1 = _buffer1;
    }
    if (_buffer2 === undefined) {
      this._buffer2 = new GLBuffer(gl, gl.ARRAY_BUFFER, _drawType);
      this._buffer2.bufferDataLength(_length * stride);
    } else {
      this._buffer2 = _buffer2;
    }
    this._buffer1Ind = this._buffer1.bufferIndex;
    this._buffer2Ind = this._buffer2.bufferIndex;
    this._vao1 = new GLVao(gl, _interleavedDataType.createAttributes(gl, this._buffer1, stride));
    this._vao2 = new GLVao(gl, _interleavedDataType.createAttributes(gl, this._buffer2, stride));
    this._bufferSwapped = false;
  }

  get length() {
    return this._length;
  }

  getBufferIn(): GLBuffer {
    return this._bufferSwapped === false ? this._buffer1 : this._buffer2;
  }
  getBufferOut(): GLBuffer {
    return this._bufferSwapped === true ? this._buffer1 : this._buffer2;
  }

  getVaoIn(): GLVao {
    return this._bufferSwapped === false ? this._vao1 : this._vao2;
  }
  getVaoOut(): GLVao {
    return this._bufferSwapped === true ? this._vao1 : this._vao2;
  }

  applyPass(shaderState: GLTransformFeedbackShaderState, length = this._length) {
    const bufferSwapped = this._bufferSwapped;
    const vaoIn = bufferSwapped === true ? this._vao2 : this._vao1;
    const bufferOut = bufferSwapped === true ? this._buffer1 : this._buffer2;
    const vaoOut = bufferSwapped === false ? this._vao2 : this._vao1;
    this._bufferSwapped = !bufferSwapped;

    this.gl.useProgram(shaderState.getProgram());
    shaderState.syncUniforms();

    applyPointsTransformPass(
      <WebGL2RenderingContext>this.gl,
      this._transformFeedback,
      vaoIn.indexVao,
      bufferOut.bufferIndex,
      length,
    );
    return vaoOut;
  }
  destroy(): void {
    this._vao1.destroy();
    this._vao2.destroy();
    (<WebGL2RenderingContext>this.gl).deleteTransformFeedback(this._transformFeedback);
    if (this.__destroyBuffer1) this._buffer1.destroy();
    if (this.__destroyBuffer2) this._buffer2.destroy();

    delete this._vao1;
    delete this._vao2;
    delete this._buffer1;
    delete this._buffer2;
    delete this._transformFeedback;
  }
}
