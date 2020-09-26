import { vec2 } from 'gl-matrix';
import { GLDefaultAttributesLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { IGLSpriteShaderState } from '../../shaders/SpriteShader';
import { Camera } from '../../3d/Camera';

const VERTEX_BATCH_SIZE = 2300;
const INDICES_BATCH_SIZE = 4500;

const BATCH_DATA_NB_FLOAT = 4;
const VERTEX_STRIDE = BATCH_DATA_NB_FLOAT * Float32Array.BYTES_PER_ELEMENT;
const VERTEX_BUFFER_SIZE = VERTEX_BATCH_SIZE * VERTEX_STRIDE;

const INDICES_BUFFER_SIZE = INDICES_BATCH_SIZE * Uint16Array.BYTES_PER_ELEMENT;
export class SimpleSpriteBatchData {
  pos: vec2;
  uv: vec2;
  // color: vec4;

  constructor(bitOffset: number, buffer: ArrayBuffer) {
    this.pos = new Float32Array(buffer, bitOffset, 2) as vec2;
    this.uv = new Float32Array(buffer, bitOffset + 2 * Float32Array.BYTES_PER_ELEMENT, 2) as vec2;
    // this.color = new Float32Array(buffer, bitOffset + 4 * Float32Array.BYTES_PER_ELEMENT, 4) as vec4;
  }
}

export interface SimpleSpriteBatchPullable {
  pull(
    batch: SimpleSpriteBatch,
    vertices: SimpleSpriteBatchData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void;
}

export interface SimpleSpriteBatchRenderable<WorldCoordsT> {
  draw(batch: SimpleSpriteBatch, parentWorldCoords?: WorldCoordsT): void;
}

export class SimpleSpriteBatch {
  private vao: WebGLVertexArrayObject;
  private verticesBuffer: WebGLBuffer;
  private indicesBuffer: WebGLBuffer;

  private indicesInd = 0;
  private verticesInd = 0;
  private currentTexture: WebGLTexture = null;

  private gl: WebGL2RenderingContext;

  private indices = new Uint16Array(INDICES_BATCH_SIZE);
  private verticesSlice: Uint8Array;
  private vertices: SimpleSpriteBatchData[];
  private currentShaderState: IGLSpriteShaderState;
  private currentPassCam: Camera;

  constructor(gl: WebGL2RenderingContext) {
    this.verticesSlice = new Uint8Array(VERTEX_BUFFER_SIZE);
    this.vertices = new Array(VERTEX_BATCH_SIZE);

    const vertexBuffer = this.verticesSlice.buffer;
    for (let i = 0; i < VERTEX_BATCH_SIZE; i++) {
      this.vertices[i] = new SimpleSpriteBatchData(i * VERTEX_STRIDE, vertexBuffer);
    }

    // create gl objects
    this.vao = gl.createVertexArray();
    this.verticesBuffer = gl.createBuffer();
    this.indicesBuffer = gl.createBuffer();
    this.gl = gl;
    // this.program = program;

    // setup buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTEX_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, INDICES_BUFFER_SIZE, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // setup vao
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.vertexAttribPointer(GLDefaultAttributesLocation.POSITION, 2, gl.FLOAT, false, VERTEX_STRIDE, 0);
    gl.enableVertexAttribArray(GLDefaultAttributesLocation.POSITION);
    gl.vertexAttribPointer(
      GLDefaultAttributesLocation.UV,
      2,
      gl.FLOAT,
      false,
      VERTEX_STRIDE,
      2 * Float32Array.BYTES_PER_ELEMENT,
    );
    gl.enableVertexAttribArray(GLDefaultAttributesLocation.UV);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  begin<SS extends IGLSpriteShaderState>(shaderState: SS, cam?: Camera): void {
    this.indicesInd = 0;
    this.verticesInd = 0;
    this.currentTexture = null;
    this.currentShaderState = shaderState;
    if (cam !== undefined) {
      this.currentPassCam = cam;
    }
  }

  /**
   * Manually reduce indices and vertex index, use for elements which will use less indices or vertex than requested
   * @param nbIndices nb indice to reduce
   * @param nbVertex nb vertex to reduce
   */
  public reduce(nbIndices: number, nbVertex: number): void {
    this.indicesInd -= nbIndices;
    this.verticesInd -= nbVertex;
  }

  changeShader<SS extends IGLSpriteShaderState>(shaderState: SS): void {
    this.end();
    this.begin(shaderState);
  }

  // private render() {}

  push(nbIndices: number, nbVertex: number, texture: WebGLTexture, pullable: SimpleSpriteBatchPullable): void {
    // console.log(nbVertex, nbIndices);

    if (
      this.currentTexture !== null &&
      (this.currentTexture !== texture ||
        this.indicesInd + nbIndices > INDICES_BATCH_SIZE ||
        this.verticesInd + nbVertex > VERTEX_BATCH_SIZE)
    ) {
      this.end();
    }

    if (this.currentTexture !== texture) this.currentTexture = texture;
    pullable.pull(this, this.vertices, this.indices, this.verticesInd, this.indicesInd);

    this.verticesInd += nbVertex;
    this.indicesInd += nbIndices;
  }

  destroy(): void {
    this.gl.deleteBuffer(this.indicesBuffer);
    this.gl.deleteBuffer(this.verticesBuffer);
    this.gl.deleteVertexArray(this.vao);
  }

  end(): void {
    if (this.currentTexture !== null && (this.indicesInd !== 0 || this.verticesInd !== 0)) {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticesSlice, 0, this.verticesInd * VERTEX_STRIDE);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this.indices, 0, this.indicesInd);
      // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindVertexArray(this.vao);
      gl.useProgram(this.currentShaderState.getProgram());
      gl.bindTexture(gl.TEXTURE_2D, this.currentTexture);
      this.currentPassCam.vp(this.currentShaderState.mvp);
      this.currentShaderState.syncUniforms();
      gl.drawElements(gl.TRIANGLES, this.indicesInd, gl.UNSIGNED_SHORT, 0);
      this.indicesInd = 0;
      this.verticesInd = 0;
    }
  }
}
