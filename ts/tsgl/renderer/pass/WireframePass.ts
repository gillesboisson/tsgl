import { IGLPass } from '../../../gl/pass/IGLPass';
import { AWasmGLPass } from '../../../gl/pass/AWasmGLPass';
import { GLCore } from '../../../gl/core/GLCore';
import { GLBuffer } from '../../../gl/core/data/GLBuffer';
import { GLVao, AnyWebGLVertexArrayObject } from '../../../gl/core/data/GLVao';
import { GLRenderer } from '../../../gl/core/GLRenderer';
import { WasmVertexElementBatch } from '../../../geom/WasmVertexElementBatch';
import { PositionColor } from '../../../gl/data/PositionColor';
import { getUniformsLocation } from '../../../gl/core/shader/getUniformsLocation';
import { structAttr, wasmPtrAttr } from '../../../core/decorators/StructAttribute';
import { mat4 } from 'gl-matrix';
import { AWasmBatchPass } from '../../../gl/pass/AWasmBatchPass';
import { wasmStruct } from '../../../wasm/decorators/classes';

export interface IWireframePass extends IGLPass {}

@wasmStruct({ methodsPrefix: 'WireframePass_' })
export class WireframePass extends AWasmBatchPass<PositionColor> implements IWireframePass {
  @structAttr({
    length: 16,
    type: Float32Array,
  })
  mvp: mat4;
  protected _program: WebGLProgram;
  protected _mvpLocation: WebGLUniformLocation;

  constructor(renderer: GLRenderer, vertexLength: number, indexLength: number, module?: EmscriptenModule) {
    super(renderer, PositionColor, vertexLength, indexLength, module);
  }

  init(firstInit?: boolean) {
    mat4.identity(this.mvp);
  }

  prepare() {
    super.prepare();
    this._program = this.renderer.getShader('wireframe').getProgram();
    this._mvpLocation = getUniformsLocation(this.gl, this._program).mvp;
  }

  bind(): void {}
  apply(): void {
    const gl = this.gl;
    gl.useProgram(this._program);
    gl.uniformMatrix4fv(this._mvpLocation, false, this.mvp);
    gl.drawElements(gl.LINES, this.indexInd, gl.UNSIGNED_SHORT, 0);
    gl.useProgram(null);
  }
}
