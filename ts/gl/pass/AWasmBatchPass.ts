import { VertexElementBatch } from '../../geom/VertexElementBatch';
import { IInterleaveData } from '../data/IInterleaveData';
import { InterleavedDataType } from '../data/InterleavedData';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { IGLCore } from '../core/IGLCore';
import { IGLPass, IBind } from './IGLPass';
import { IDestroy } from '../../core/IDestroy';
import { GLBuffer } from '../core/data/GLBuffer';
import { GLVao } from '../core/data/GLVao';
import { InterleaveGLDataType } from '../data/InterleaveGLDataType';
import { GLRenderer } from '../core/GLRenderer';

export abstract class AWasmBatchPass<VertexType extends IInterleaveData> extends VertexElementBatch<VertexType>
  implements IGLPass, IBind, IDestroy {
  protected vertexGLBuffer: GLBuffer;
  protected indexGLBuffer: GLBuffer;
  vao: GLVao;
  protected _indexBufferInd: WebGLBuffer;
  protected _vertexBufferInd: WebGLBuffer;
  protected gl: AnyWebRenderingGLContext;
  protected renderer: GLRenderer;

  constructor(
    renderer: GLRenderer,
    vertexType: InterleaveGLDataType<VertexType>,
    vertexLength: number,
    indexLength: number,
    module?: EmscriptenModule,
  ) {
    super(vertexType, vertexLength, indexLength, module);
    this.renderer = renderer;
    this.gl = renderer.getGL();
  }

  getGL() {
    return this.gl;
  }

  begin() {
    super.begin();
    this.bind();
  }

  push() {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferInd);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferInd);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this.indexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.vao.bind();
    this.apply();
    this.vao.unbind();
  }

  prepare(): void {
    const gl = this.gl;
    this.vertexGLBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, this.vertexBuffer);
    this.indexGLBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.DYNAMIC_DRAW, this.indexBuffer);
    this.vao = new GLVao(
      gl,
      (<InterleaveGLDataType<VertexType>>this._vertexType).createAttributes(gl, this.vertexGLBuffer),
      this.indexGLBuffer,
    );
    this._indexBufferInd = this.indexGLBuffer.bufferIndex;
    this._vertexBufferInd = this.vertexGLBuffer.bufferIndex;
  }

  protected upload() {}

  abstract bind(): void;
  abstract apply(): void;

  destroy(freePtr?: boolean) {
    const gl = this.gl;
    gl.deleteBuffer(this._vertexBufferInd);
    gl.deleteBuffer(this._indexBufferInd);
    this.vao.destroy();

    super.destroy(freePtr);
  }
}
