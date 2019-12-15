import { EmscriptenModuleLoader } from './wasm/EmscriptenModuleLoader';
import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { SimpleColorShader } from './shaders/SimpleColorShader';
import { WasmClass } from './wasm/WasmClass';
import { vec3, vec2 } from 'gl-matrix';
import { structAttr } from './core/decorators/StructAttribute';
import { GLDefaultAttributesLocation } from './gl/core/data/GLDefaultAttributesLocation';
import { WasmBuffer } from './wasm/WasmBuffer';
import { wasmStruct } from './wasm/decorators/classes';
import { WasmAllocatorI } from './wasm/allocators/interfaces';
import { TestTFShaderRender } from './shaders/TestTFShaderRender';
import { GLVao } from './gl/core/data/GLVao';
import { glInterleavedAttributes } from './gl/core/data/gLInterleavedAttributes';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLAttribute } from './gl/core/data/GLAttribute';
import { TestTFShader } from './shaders/TestTFShader';
import { GLTransformFeedbackPass } from './gl/core/GLTransformFeedbackPass';

const loader: EmscriptenModuleLoader = new EmscriptenModuleLoader();

var SPECTOR = require('spectorjs');

const DEBUG = false;
const DEBUG_COMMANDS_START = false;
let spector: any = null;

if (DEBUG) {
  spector = new SPECTOR.Spector();
}

@wasmStruct({})
@glInterleavedAttributes()
class WasmVertexTest extends WasmClass {
  static byteLength: number;
  static allocator: WasmAllocatorI<WasmVertexTest>;
  static createAttributes: (gl: AnyWebRenderingGLContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @structAttr({
    type: Float32Array,
    length: 2,
    gl: {
      location: GLDefaultAttributesLocation.IPOSITION,
    },
  })
  position: vec2;

  @structAttr({
    type: Float32Array,
    length: 2,
    gl: {
      location: GLDefaultAttributesLocation.IVELOCITY,
    },
  })
  velocity: vec2;
}

loader.load('em_app.js').then((module) => {
  const renderer = GLRenderer.createFromCanvas(
    document.getElementById('test') as HTMLCanvasElement,
    GLRendererType.WebGL2,
  );
  const gl = <WebGL2RenderingContext>renderer.getGL();

  if (DEBUG) {
    spector.displayUI();

    if (DEBUG_COMMANDS_START) spector.captureContext(gl, 33);
  }

  const buffer = new WasmBuffer({
    length: 1024 * 512,
    wasmType: WasmVertexTest,
  });

  const wasm_randomVBuffer: (ptr: number, amount: number) => void = module.cwrap('randomVBuffer', null, [
    'number',
    'number',
  ]);

  const wasm_applyTransformFeeback: (ptr: number, amount: number) => void = module.cwrap(
    'applyTransformFeeback',
    null,
    ['number', 'number'],
  );

  wasm_randomVBuffer(buffer.ptr, buffer.length);

  const tfShader = new TestTFShader(gl);
  const tfShaderState = tfShader.createState();
  const tf = new GLTransformFeedbackPass(gl, WasmVertexTest, buffer.length);
  tf.getBufferIn().bufferSubData(buffer.bufferView);

  const renderShader = new TestTFShaderRender(gl);
  const renderShaderState = renderShader.createState();

  // const glBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, buffer.bufferView);
  // const attributes = WasmVertexTest.createAttributes(gl, glBuffer);
  // const vao = new GLVao(gl, attributes);

  function render() {
    window.requestAnimationFrame(render);
    renderer.clear();

    renderShaderState.use();

    /*
    wasm_applyTransformFeeback(buffer.ptr, buffer.length);
    glBuffer.bufferSubData();
    vao.bind();
    */

    tf.applyPass(tfShaderState).bind();
    renderShaderState.use();
    gl.drawArrays(gl.POINTS, 0, buffer.length);
  }

  render();
});
