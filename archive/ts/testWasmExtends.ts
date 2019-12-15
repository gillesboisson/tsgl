import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLShader } from './gl/core/shader/GLShader';
import { getDefaultAttributeLocation, GLDefaultAttributesLocation } from './gl/core/data/GLDefaultAttributesLocation';
import { IInterleavedData, InterleavedDataArray } from './gl/data/InterleavedData';
import { interleavedData } from './gl/data/InterleavedData.decorator';

import { GLTexture } from './gl/core/GLTexture';
import { GLAttribute } from './gl/core/data/GLAttribute';
import { GLMesh } from './gl/core/data/GLMesh';
import { AGLBatch, GLBatchable, pullMethod } from './gl/core/data/AGLBatch';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLFramebuffer } from './gl/core/framebuffer/GLFramebuffer';
import { glInterleavedAttributes } from './gl/core/data/gLInterleavedAttributes';
import { GLAttributesCollection } from './gl/core/data/GLAttributesCollection';
import { cpus } from 'os';
import { SimpleColorShader } from './shaders/SimpleColorShader';
import { GLVariantShader } from './gl/core/shader/variants/GLVariantShader';
import { TestVariantShader, ColorMode } from './shaders/TestVariantShader';
import { TestUBOShader, TestUBOShaderState } from './shaders/TestUboShader';
import { TestTFShader } from './shaders/TestTFShader';
import { generateTriangle } from './shaders/generateTriangle';
import { generateRandomData } from './shaders/generateRandomData';
import { TestTFdata } from './shaders/TestTFdata';
import { TestTFShaderRender } from './shaders/TestTFShaderRender';
import { GLVao } from './gl/core/data/GLVao';
import { compileTFProgram } from './gl/core/shader/compileProgram';
import { GLTransformFeedbackPass } from './gl/core/GLTransformFeedbackPass';
import { WasmClass } from './wasm/WasmClass';
import { structAttr } from './core/decorators/StructAttribute';

let tr: WasmClass;

var SPECTOR = require('spectorjs');

const DEBUG = false;
const DEBUG_COMMANDS_START = false;
let spector: any = null;

if (DEBUG) {
  spector = new SPECTOR.Spector();
}

@glInterleavedAttributes()
@interleavedData()
class PosUvColor implements IInterleavedData {
  static createAttributes: (gl: AnyWebRenderingGLContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @structAttr({
    type: Float32Array,
    length: 3,
    gl: { location: GLDefaultAttributesLocation.POSITION },
  })
  public position: vec3;

  @structAttr({
    type: Float32Array,
    length: 2,
    gl: { location: GLDefaultAttributesLocation.UV },
  })
  public uv: vec2;

  @structAttr({
    type: Float32Array,
    length: 4,
    gl: { location: GLDefaultAttributesLocation.COLOR },
  })
  public color: vec4;

  allocate(array: InterleavedDataArray<PosUvColor>, arrayBuffer: ArrayBuffer, offset: number, stride: number): void {}
}

window.addEventListener('load', () => {
  const renderer = GLRenderer.createFromCanvas(
    document.getElementById('test') as HTMLCanvasElement,
    GLRendererType.WebGL2,
  );

  const gl = renderer.getGL() as WebGL2RenderingContext;

  const data = new Float32Array([-1, -1, 0, 0, 0, 1, -1, 0, 1, 0, -1, 1, 0, 0, 1, 1, 1, 0, 1, 1]);

  // prettier-ignore
  const posUvColdata = new Float32Array([
    -1, -1, 0,  0, 0,   1, 0, 0, 1,
    1, -1, 0,   1, 0,   0, 1, 0, 1,
    -1, 1, 0,   0, 1,   0, 0, 1, 1,
    1, 1, 0,    1, 1,   1, 0, 1, 1,
  ]);

  const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

  const vertexB = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, posUvColdata);
  const indicesB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, indices);
  const attributes = PosUvColor.createAttributes(gl, vertexB);
  // const attributes = [new GLAttribute(gl, vertexB, GLDefaultAttributesLocation.POSITION,'position',3,3*Float32Array.BYTES_PER_ELEMENT)];
  const mesh = new GLMesh(gl, 4, 2, attributes, indicesB, gl.TRIANGLES);

  // const intData = generateRandomData();
  // const buffer1 = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW, intData.bufferView);
  // const buffer2 = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STREAM_DRAW);
  // buffer2.bufferDataLength(intData.byteLength);
  // const vao1 = new GLVao(gl, TestTFdata.createAttributes(gl, buffer1));
  // const vao2 = new GLVao(gl, TestTFdata.createAttributes(gl, buffer2));

  // let bufferSwapped = false;

  // const transformFeedback = gl.createTransformFeedback();

  const shaderTFRender = new TestTFShaderRender(gl);
  const testTFShader = new TestTFShader(gl);
  const testTFShaderState = testTFShader.createState();

  const transformPass = new GLTransformFeedbackPass<TestTFdata>(gl, TestTFdata, 2056);

  const intData = generateRandomData(transformPass.length);

  transformPass.getBufferIn().bufferSubData(intData.bufferView);

  const tfTestVertSrc = require('./shaders/glsl/testTF.vert').default;

  const tfShaderProgram = compileTFProgram(
    gl,
    tfTestVertSrc,
    ['oposition', 'ovelocity'],
    gl.INTERLEAVED_ATTRIBS,
    getDefaultAttributeLocation(['iposition', 'ivelocity']),
  );

  if (DEBUG) {
    spector.displayUI();

    if (DEBUG_COMMANDS_START) spector.captureContext(gl, 33);
  }

  gl.disable(gl.CULL_FACE);
  gl.disable(gl.DEPTH_TEST);

  function render() {
    window.requestAnimationFrame(render);
    renderer.clear();

    /*
    const vaoIn = bufferSwapped === true ? vao2 : vao1;
    const bufferOut = bufferSwapped === true ? buffer1 : buffer2;

    const vaoOut = bufferSwapped === false ? vao2 : vao1;

    bufferSwapped = !bufferSwapped;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    gl.useProgram(tfShaderProgram);
    vaoIn.bind();
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, bufferOut.bufferIndex);
    gl.beginTransformFeedback(gl.POINTS);

    gl.drawArrays(gl.POINTS, 0, 16);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
    */

    const vaoOut = transformPass.applyPass(testTFShaderState);
    shaderTFRender.use();
    vaoOut.bind();
    gl.drawArrays(gl.POINTS, 0, transformPass.length);

    // testUboShaderState.use();
    // testUboShaderState.syncUniforms();
    //myVariantShaderState.syncUniforms();

    // myShader.use();
    // myShaderState.use();
    // myShaderState.syncUniforms();
    // mesh.draw();
  }

  const img = document.createElement('img') as HTMLImageElement;

  img.addEventListener('load', () => {
    // setTimeout(() => {
    const texture = new GLTexture(gl, gl.TEXTURE_2D, img.width, img.height);
    texture.uploadImage(img, gl.RGB);
    texture.active(0);
    // myShader.getUniforms().textureInd = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    render();
    // }, 1000);
  });

  img.src = './images/bb.jpg';
  // setTimeout(() => (myVariantShaderState.colorMode = ColorMode.Green), 3000);
});
