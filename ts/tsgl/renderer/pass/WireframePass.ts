import { IGLPass } from '../../../gl/pass/IGLPass';
import { AWasmGLPass } from '../../../gl/pass/AWasmGLPass';
import { GLCore } from '../../../gl/core/GLCore';
import { GLBuffer } from '../../../gl/core/data/GLBuffer';
import { GLVao, AnyWebGLVertexArrayObject } from '../../../gl/core/data/GLVao';
import { GLRenderer } from '../../../gl/core/GLRenderer';
import { VertexElementBatch } from '../../../geom/VertexElementBatch';
import { PositionColor } from '../../../gl/data/PositionColor';
import { getUniformsLocation } from '../../../gl/core/shader/getUniformsLocation';
import { structAttr, wasmPtrAttr } from '../../../core/decorators/StructAttribute';
import { mat4, vec4 } from 'gl-matrix';
import { AWasmBatchPass } from '../../../gl/pass/AWasmBatchPass';
import { wasmStruct } from '../../../wasm/decorators/classes';
import { box } from '../../../geom/box';

export interface IWireframePass extends IGLPass {}

let __color: vec4 = null;
let __box: box = null;

function pushBox(vertexInd: number, vertexBuffer: PositionColor[], indexInd: number, indexBuffer: Uint16Array) {
  indexBuffer[indexInd] = vertexInd;
  indexBuffer[indexInd + 1] = vertexInd + 1;
  indexBuffer[indexInd + 2] = vertexInd + 1;
  indexBuffer[indexInd + 3] = vertexInd + 2;
  indexBuffer[indexInd + 4] = vertexInd + 2;
  indexBuffer[indexInd + 5] = vertexInd + 3;
  indexBuffer[indexInd + 6] = vertexInd + 3;
  indexBuffer[indexInd + 7] = vertexInd;

  indexBuffer[indexInd + 8] = vertexInd + 4;
  indexBuffer[indexInd + 9] = vertexInd + 5;
  indexBuffer[indexInd + 10] = vertexInd + 5;
  indexBuffer[indexInd + 11] = vertexInd + 6;
  indexBuffer[indexInd + 12] = vertexInd + 6;
  indexBuffer[indexInd + 13] = vertexInd + 7;
  indexBuffer[indexInd + 14] = vertexInd + 7;
  indexBuffer[indexInd + 15] = vertexInd + 4;

  indexBuffer[indexInd + 16] = vertexInd;
  indexBuffer[indexInd + 17] = vertexInd + 4;
  indexBuffer[indexInd + 18] = vertexInd + 1;
  indexBuffer[indexInd + 19] = vertexInd + 5;
  indexBuffer[indexInd + 20] = vertexInd + 2;
  indexBuffer[indexInd + 21] = vertexInd + 6;
  indexBuffer[indexInd + 22] = vertexInd + 3;
  indexBuffer[indexInd + 23] = vertexInd + 7;

  vertexBuffer[vertexInd].position[0] = __box[0];
  vertexBuffer[vertexInd].position[1] = __box[2];
  vertexBuffer[vertexInd].position[2] = __box[4];

  vertexBuffer[vertexInd + 1].position[0] = __box[1];
  vertexBuffer[vertexInd + 1].position[1] = __box[2];
  vertexBuffer[vertexInd + 1].position[2] = __box[4];

  vertexBuffer[vertexInd + 2].position[0] = __box[0];
  vertexBuffer[vertexInd + 2].position[1] = __box[3];
  vertexBuffer[vertexInd + 2].position[2] = __box[4];

  vertexBuffer[vertexInd + 3].position[0] = __box[1];
  vertexBuffer[vertexInd + 3].position[1] = __box[3];
  vertexBuffer[vertexInd + 3].position[2] = __box[4];

  vertexBuffer[vertexInd + 4].position[0] = __box[0];
  vertexBuffer[vertexInd + 4].position[1] = __box[2];
  vertexBuffer[vertexInd + 4].position[2] = __box[5];

  vertexBuffer[vertexInd + 5].position[0] = __box[1];
  vertexBuffer[vertexInd + 5].position[1] = __box[2];
  vertexBuffer[vertexInd + 5].position[2] = __box[5];

  vertexBuffer[vertexInd + 6].position[0] = __box[0];
  vertexBuffer[vertexInd + 6].position[1] = __box[3];
  vertexBuffer[vertexInd + 6].position[2] = __box[5];
  vertexBuffer[vertexInd + 7].position[0] = __box[1];
  vertexBuffer[vertexInd + 7].position[1] = __box[3];
  vertexBuffer[vertexInd + 7].position[2] = __box[5];

  const colorStartEnd = vertexInd + 8;

  for (let i = vertexInd; i < colorStartEnd; i++) {
    vec4.copy(vertexBuffer[i].color, __color);
  }
}

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

  pushBox(box: box, color: vec4) {
    __box = box;
    __color = color;
    this.pull(8, 24, pushBox);
  }

  bind(): void {}
  apply(): void {
    const gl = this.gl;
    gl.useProgram(this._program);
    gl.uniformMatrix4fv(this._mvpLocation, false, this.mvp);
    gl.drawElements(gl.LINES, this.indexInd / Uint16Array.BYTES_PER_ELEMENT, gl.UNSIGNED_SHORT, 0);
    gl.useProgram(null);
  }
}
