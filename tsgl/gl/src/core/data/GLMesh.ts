import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLAttribute } from './GLAttribute';
import { GLBuffer } from './GLBuffer';
import { GLCore } from '../GLCore';
import { GLVao } from './GLVao';

export class GLMesh extends GLCore {
  static indicesSize(gl: AnyWebRenderingGLContext, renderType: GLenum): number {
    if (renderType === gl.POINTS) {
      return 1;
    } else if (renderType === gl.LINES || renderType === gl.LINE_LOOP || renderType === gl.LINE_STRIP) {
      return 2;
    } else if (renderType === gl.TRIANGLES || renderType === gl.TRIANGLE_STRIP || renderType === gl.TRIANGLE_FAN) {
      return 3;
    }
  }

  get vao(): GLVao {
    return this._vao;
  }

  get isInstanced(): boolean {
    return this._nbInstances > 0;
  }

  private _vao: GLVao;
  private _indicesSize: number;

  protected _nbInstances = 0;
  private buffers: GLBuffer[];

  constructor(
    gl: AnyWebRenderingGLContext,
    protected _nbPoints: number,
    protected _nbElements: number,
    protected _attributes: GLAttribute[],
    protected _indexBuffer?: GLBuffer,
    protected _renderType: GLenum = gl.TRIANGLES,
  ) {
    super(gl);
    this._vao = new GLVao(gl, _attributes, _indexBuffer);

    this.buffers = [];
    for (const attr of _attributes) {
      if (this.buffers.indexOf(attr.buffer) === -1) this.buffers.push(attr.buffer);
    }

    this._indicesSize = GLMesh.indicesSize(gl, _renderType);

    this.bindDrawMethod();
  }

  destroy(destroyBuffers = true): void {
    this._vao.destroy();
    if (destroyBuffers) {
      for (const buffer of this.buffers) buffer.destroy();
      if (this._indexBuffer !== undefined) this._indexBuffer.destroy();
    }
  }

  setInstanced(nbInstances: number): void {
    this._nbInstances = nbInstances;
    this.bindDrawMethod();
  }

  unsetInstanced(): void {
    this._nbInstances = 0;
    this.bindDrawMethod();
  }

  bufferData(): void {
    for (const buffer of this.buffers) {
      buffer.bufferSubData();
    }
  }

  protected drawElementInstanced(
    nbElements: number = this._nbElements,
    start = 0,
    bindVao = true,
    nbInstances: number = this._nbInstances,
  ): void {
    if (bindVao === true) this._vao.bind();
    (<WebGL2RenderingContext>this.gl).drawElementsInstanced(
      this._renderType,
      nbElements * this._indicesSize,
      this.gl.UNSIGNED_SHORT,
      start * this._indicesSize,
      nbInstances,
    );
    if (bindVao === true) this._vao.unbind();
  }

  protected drawArrayInstanced(
    nbElements: number = this._nbElements,
    start = 0,
    bindVao = true,
    nbInstances: number = this._nbInstances,
  ): void {
    if (bindVao === true) this._vao.bind();
    (<WebGL2RenderingContext>this.gl).drawArraysInstanced(this._renderType, start, nbElements, nbInstances);
    if (bindVao === true) this._vao.unbind();
  }

  protected drawArrays(nbElements: number = this._nbElements, start = 0, bindVao = true): void {
    if (bindVao === true) this._vao.bind();
    this.gl.drawArrays(this._renderType, start, nbElements);
    if (bindVao === true) this._vao.unbind();
  }

  protected drawElements(nbElements: number = this._nbElements, start = 0, bindVao = true): void {
    if (bindVao === true) this._vao.bind();
    this.gl.drawElements(
      this._renderType,
      nbElements * this._indicesSize,
      this.gl.UNSIGNED_SHORT,
      start * this._indicesSize,
    );
    if (bindVao === true) this._vao.unbind();
  }

  protected bindDrawMethod(): void {
    if (this._nbInstances > 0) {
      if (this.vao.indexBuffer !== undefined) {
        this.draw = this.drawElementInstanced;
      } else {
        this.draw = this.drawArrayInstanced;
      }
    } else {
      if (this.vao.indexBuffer !== undefined) {
        this.draw = this.drawElements;
      } else {
        this.draw = this.drawArrays;
      }
    }
  }

  draw(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nbElements: number = this._nbElements,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    start = 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bindVao = true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nbInstances: number = this._nbInstances,
  ): void {}
}
