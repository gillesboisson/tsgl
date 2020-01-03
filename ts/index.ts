import { EmscriptenModuleLoader } from './wasm/EmscriptenModuleLoader';
import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { SimpleColorShader } from './tsgl/shaders/SimpleColorShader';
import { vec3, vec2, mat4, quat, vec4 } from 'gl-matrix';
import { GLDefaultAttributesLocation } from './gl/core/data/GLDefaultAttributesLocation';
import { WasmBuffer } from './wasm/WasmBuffer';
import { TestTFShaderRender } from './tsgl/shaders/TestTFShaderRender';
import { GLVao } from './gl/core/data/GLVao';
import { glInterleavedAttributes } from './gl/core/data/gLInterleavedAttributes';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLAttribute } from './gl/core/data/GLAttribute';
import { TestTFShader } from './tsgl/shaders/TestTFShader';
import { GLTransformFeedbackPass } from './gl/core/GLTransformFeedbackPass';
import { SceneNode } from './3d/SceneNode';
import { WasmCamera } from './3d/Camera';
import { BasicShader } from './tsgl/shaders/BasicShader';
import { GLMesh } from './gl/core/data/GLMesh';
import { InterleavedDataArray } from './gl/data/InterleavedDataArray';
import { BOX_POSITIONS, BOX_TRIANGLES_INDICES } from './geom/primitive';
import { WasmStack } from './wasm/WasmStack';
import { WasmResizabledBuffer } from './wasm/WasmResizableBuffer';
import { WasmStructBuffer } from './wasm/WasmStructBuffer';
import { WasmPtrVector } from './wasm/WasmPtrVector';
import { SceneNodeType } from './3d/SceneNodeType';
import { proxyAllMethods } from './helpers/proxyAllMethods';
import { Frustrum } from './geom/Frustrum';
import { GLUbo } from './gl/core/data/GLUbo';
import { wasmStruct } from './wasm/decorators/classes';
import { WasmClass } from './wasm/WasmClass';
import { WasmAllocatorI } from './wasm/allocators/interfaces';
import { structAttr } from './core/decorators/StructAttribute';
import { VertexElementBatch } from './geom/VertexElementBatch';
import { WireframeShader } from './tsgl/shaders/WireframeShader';
import { GLSupport } from './gl/core/GLSupport';
import { PositionColor } from './gl/data/PositionColor';
import { WireframePass } from './tsgl/renderer/pass/WireframePass';
import { AWasmGLPass } from './gl/pass/AWasmGLPass';
import { BaseRenderer } from './tsgl/renderer/Renderer';
import { NodePass } from './tsgl/renderer/pass/NodePass';
import { QueuePassCollection } from './tsgl/renderer/pass/QueuePassCollection';
import { box } from './geom/box';
// @glInterleavedAttributes()  // webggl attributes support

class MyPass extends AWasmGLPass {
  init(firstInit: boolean) {
    super.init(firstInit);
    console.log('MyPass -> init');
    this.initPassWasmBinding();
  }

  prepare() {
    console.log('prepare');
  }

  bind() {
    console.log('bind');
  }

  apply() {
    console.log('apply');
  }
}

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

const loader: EmscriptenModuleLoader = new EmscriptenModuleLoader();

const DEBUG_COMMANDS_START = false;
const DEBUG_COMMANDS_NB = 150;

loader.load('em_app.js').then((module) => {
  const renderer: BaseRenderer = GLRenderer.createFromCanvas<BaseRenderer>(
    document.getElementById('test') as HTMLCanvasElement,
    GLRendererType.WebGL2,
    BaseRenderer,
  );

  const gl = <WebGL2RenderingContext>renderer.getGL();
  let watching = DEBUG_COMMANDS_START;

  if (DEBUG_COMMANDS_START) {
    proxyAllMethods(
      gl,
      (name, args) => console.log(name, args),
      DEBUG_COMMANDS_NB,
      () => (watching = false),
    );
  }

  renderer.registerShaderFromClass(BasicShader);
  renderer.registerShaderFromClass(WireframeShader);

  // const batch = new WasmVertexElementBatch(PositionColor, 17, 13);

  const wireframeB = new WireframePass(renderer, 128, 128, module);
  wireframeB.prepare();

  function pullV(vertexInd: number, collection: PositionColor[], indexInd: number, indexBuffer: Uint16Array) {
    const x = 0;
    const y = 0;
    const z = 0;

    vec3.set(collection[vertexInd].position, x - 0.5, y - 0.5, z);
    vec3.set(collection[vertexInd + 1].position, x + 0.5, y - 0.5, z);
    vec3.set(collection[vertexInd + 2].position, x - 0.5, y + 0.5, z);
    vec3.set(collection[vertexInd + 3].position, x + 0.5, y + 0.5, z);

    for (let i = 0; i < 4; i++) {
      const element = collection[i + vertexInd];
      vec4.set(element.color, 1, 0, 1, 1);
    }

    indexBuffer[indexInd] = vertexInd + 0;
    indexBuffer[indexInd + 1] = vertexInd + 1;
    indexBuffer[indexInd + 2] = vertexInd + 1;
    indexBuffer[indexInd + 3] = vertexInd + 3;
    indexBuffer[indexInd + 4] = vertexInd + 3;
    indexBuffer[indexInd + 5] = vertexInd + 2;
    indexBuffer[indexInd + 6] = vertexInd + 2;
    indexBuffer[indexInd + 7] = vertexInd + 0;
  }

  const cam = new WasmCamera();

  cam.perspective(70, renderer.width / renderer.height);

  cam.transform.setPosition(0, 0, 10);

  const camMovVec = vec3.create();
  const camSpeed = 0.1;

  const ident = mat4.create();

  const bounds = box.fromCenterSize(vec3.fromValues(1, 1, 1), vec3.fromValues(2, 3, 4));
  const bounds2 = box.fromCenterSize(vec3.fromValues(4, 1, 1), vec3.fromValues(1, 1, 1));
  const color = vec4.fromValues(1, 0, 0, 1);

  function render() {
    window.requestAnimationFrame(render);

    renderer.clear();

    cam.transform.setEulerRotation(
      (-mouseState.y / window.innerHeight) * Math.PI * 2 - Math.PI,
      (-mouseState.x / window.innerWidth) * Math.PI * 2 - Math.PI,
      0,
    );

    vec3.set(camMovVec, 0, 0, 0);

    if (keyState.up) {
      camMovVec[2] -= camSpeed;
    }

    if (keyState.down) {
      camMovVec[2] += camSpeed;
    }
    if (keyState.left) {
      camMovVec[0] -= camSpeed;
    }
    if (keyState.right) {
      camMovVec[0] += camSpeed;
    }

    vec3.transformQuat(camMovVec, camMovVec, cam.transform.rotation);
    cam.transform.translateVec(camMovVec);

    cam.wasmUpdateWorldMat(null, false);
    cam.mvp(ident, wireframeB.mvp);
    wireframeB.begin();

    wireframeB.pushBox(bounds2, color);
    wireframeB.pushBox(bounds, color);

    wireframeB.pull(4, 8, pullV);

    wireframeB.end();
  }

  render();
});
