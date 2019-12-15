import { EmscriptenModuleLoader } from './wasm/EmscriptenModuleLoader';
import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { SimpleColorShader } from './shaders/SimpleColorShader';
import { WasmClass } from './wasm/WasmClass';
import { vec3, vec2, mat4, quat } from 'gl-matrix';
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
import { WasmSceneNode } from './3d/WasmSceneNode';
import { WasmCamera } from './3d/WasmCamera';
import { BasicShader } from './shaders/BasicShader';
import { GLMesh } from './gl/core/data/GLMesh';
import { InterleavedDataArray } from './gl/data/InterleavedDataArray';
import { BOX_POSITIONS, BOX_TRIANGLES_INDICES } from './geom/primitive';

const loader: EmscriptenModuleLoader = new EmscriptenModuleLoader();

var SPECTOR = require('spectorjs');

const DEBUG = false;
const DEBUG_COMMANDS_START = false;
let spector: any = null;

if (DEBUG) {
  spector = new SPECTOR.Spector();
}

loader.load('em_app.js').then((module) => {
  const renderer = GLRenderer.createFromCanvas(
    document.getElementById('test') as HTMLCanvasElement,
    // GLRendererType.WebGL2,
  );
  const gl = <WebGL2RenderingContext>renderer.getGL();
  let watching = false;
  // proxyAllMethods(gl, (name, args) => console.log(name, args),100,() => watching = false);

  const posBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, new Float32Array(BOX_POSITIONS));
  const colorBuffer = new GLBuffer(
    gl,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW,
    new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1]),
  );
  const indicesBuffer = new GLBuffer(
    gl,
    gl.ELEMENT_ARRAY_BUFFER,
    gl.STATIC_DRAW,
    new Uint16Array(BOX_TRIANGLES_INDICES),
  );

  const attributes = [
    new GLAttribute(
      gl,
      posBuffer,
      GLDefaultAttributesLocation.POSITION,
      'position',
      3,
      3 * Float32Array.BYTES_PER_ELEMENT,
    ),
    new GLAttribute(gl, colorBuffer, GLDefaultAttributesLocation.COLOR, 'color', 4, 4 * Float32Array.BYTES_PER_ELEMENT),
  ];

  const shader = new BasicShader(gl);
  const shaderState = shader.createState();

  const mesh = new GLMesh(gl, 8, 12, attributes, indicesBuffer);
  if (DEBUG) {
    spector.displayUI();

    if (DEBUG_COMMANDS_START) spector.captureContext(gl, 33);
  }

  const node = new WasmSceneNode();
  const cam = new WasmCamera();

  cam.perspective(70, renderer.width / renderer.height);

  cam.transform.setPosition(0, 0, 10);

  const mouseState = {
    x: 0,
    y: 0,
    leftM: false,
  };

  const keyState = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  document.addEventListener('mousemove', (mouseEvent: MouseEvent) => {
    mouseState.x = mouseEvent.clientX;
    mouseState.y = mouseEvent.clientY;
  });

  document.addEventListener('mousedown', () => (mouseState.leftM = true));
  document.addEventListener('mouseup', () => (mouseState.leftM = false));

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 81:
        keyState.left = true;
        break;
      case 68:
        keyState.right = true;

        break;
      case 90:
        keyState.up = true;

        break;
      case 83:
        keyState.down = true;

        break;
    }
  });
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 81:
        keyState.left = false;
        break;
      case 68:
        keyState.right = false;

        break;
      case 90:
        keyState.up = false;

        break;
      case 83:
        keyState.down = false;

        break;
    }
  });

  const camMovVec = vec3.create();
  const camSpeed = 0.1;

  function render() {
    window.requestAnimationFrame(render);

    renderer.clear();
    if (watching) console.log('--------------------------------------------------------');

    node.wasmUpdateWorldMat(0, false);
    cam.wasmUpdateWorldMat(0, false);

    cam.transform.setEulerRotation(
      (-mouseState.y / window.innerHeight) * Math.PI * 2 - Math.PI,
      (-mouseState.x / window.innerWidth) * Math.PI * 2 - Math.PI,
      0,
    );

    vec3.set(camMovVec, 0, 0, 0);

    if (keyState.up) {
      camMovVec[2] += camSpeed;
    }

    if (keyState.down) {
      camMovVec[2] -= camSpeed;
    }
    if (keyState.left) {
      camMovVec[0] += camSpeed;
    }
    if (keyState.right) {
      camMovVec[0] -= camSpeed;
    }

    vec3.transformQuat(camMovVec, camMovVec, cam.transform.rotation);

    node.transform.translateVec(camMovVec);

    cam.mvp(node.worldMat, shaderState.mvp);

    shaderState.start();
    mesh.draw();
  }

  render();
});
