import { GLTransformFeedbackShader, GLTransformFeedbackShaderState } from '../../gl/core/data/GLTFShader';
import { vec3 } from 'gl-matrix';
import { GLVao } from '../../gl/core/data/GLVao';
import { getDefaultAttributeLocation } from '../../gl/core/data/GLDefaultAttributesLocation';

/*
export class TestTFShaderState extends GLTransformFeedback {
  protected bufferData: InterleavedDataArray<TestTFdata>;
  protected buffer1: GLBuffer;
  protected buffer2: GLBuffer;
  protected buffer1Ind: WebGLBuffer;
  protected buffer2Ind: WebGLBuffer;
  vao1: GLVao;
  vao2: GLVao;
  vao1Ind: WebGLVertexArrayObject;
  vao2Ind: WebGLVertexArrayObject;
  swapedB: boolean;

  constructor(shader: TestTFShader) {
    super(shader);
    const gl = <WebGL2RenderingContext>shader.getGL();

    this.bufferData = generateRandomData();
    const collection = this.bufferData.collection;

    for (const data of collection) {
      vec2.set(data.position, Math.random() * 2 - 1, Math.random() * 2 - 1);
      vec2.set(data.velocity, Math.random() * 0.002 - 0.001, 0);
    }

    this.buffer1 = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, this.bufferData.bufferView);
    this.buffer2 = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, this.bufferData.bufferView);

    this.vao1 = new GLVao(gl, TestTFdata.createAttributes(gl, this.buffer1));
    this.vao2 = new GLVao(gl, TestTFdata.createAttributes(gl, this.buffer2));

    this.vao1Ind = this.vao1.indexVao;
    this.vao2Ind = this.vao2.indexVao;

    this.buffer2 = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, this.bufferData.bufferView);

    this.buffer1Ind = this.buffer1.bufferIndex;
    this.buffer2Ind = this.buffer2.bufferIndex;

    this.swapedB = false;
  }

  syncUniforms() {}

  compute() {
    const gl = <WebGL2RenderingContext>this.gl;
    gl.useProgram(this._program);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this._transformFeeback);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.swapedB === true ? this.buffer1Ind : this.buffer2Ind);

    gl.bindVertexArray(this.swapedB === true ? this.vao2Ind : this.vao1Ind);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, this.bufferData.collection.length);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    this.swapedB = !this.swapedB;

    return this.swapedB === false ? this.vao1 : this.vao2;
  }

  upload() {}
}
*/

const shaderSrc = require('./glsl/testTF.vert').default;

export class TestTFShaderState extends GLTransformFeedbackShaderState {
  syncUniforms(): void {}
}

export class TestTFShader extends GLTransformFeedbackShader<TestTFShaderState> {
  constructor(gl: WebGL2RenderingContext) {
    super(
      gl,
      shaderSrc,
      ['oposition', 'ovelocity'],
      gl.INTERLEAVED_ATTRIBS,
      TestTFShaderState,
      getDefaultAttributeLocation(['iposition', 'ivelocity']),
    );
  }
}
