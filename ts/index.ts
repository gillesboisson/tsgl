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
import { allocateTypedArray } from './wasm/utils';
import { createVertices } from './geom/createVertices';
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
  axeXP: false,
  axeXM: false,
  axeYP: false,
  axeYM: false,
  axeZP: false,
  axeZM: false,
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
    //  ------------------------------------------------------------------------------------
    case 52:
      keyState.axeXM = true;
      break;
    case 54:
      keyState.axeXP = true;
      break;
    case 50:
      keyState.axeYM = true;
      break;
    case 56:
      keyState.axeYP = true;
      break;
    case 55:
      keyState.axeZM = true;
      break;
    case 57:
      keyState.axeZP = true;
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
    case 52:
      keyState.axeXM = false;
      break;
    case 54:
      keyState.axeXP = false;
      break;
    case 50:
      keyState.axeYM = false;
      break;
    case 56:
      keyState.axeYP = false;
      break;
    case 55:
      keyState.axeZM = false;
      break;
    case 57:
      keyState.axeZP = false;
      break;
  }
});

const loader: EmscriptenModuleLoader = new EmscriptenModuleLoader();

const DEBUG_COMMANDS_START = false;
const DEBUG_COMMANDS_NB = 150;

loader.load('em_app.js').then((module) => {
  // const node = new SceneNode(module);
  // const sNode = new SceneNode(module);
  // const ssNode = new SceneNode(module);

  // node.addChild(sNode);
  // sNode.addChild(ssNode);

  // sNode.visible = false;

  // console.log('test visibility 1', node.worldVisible, sNode.worldVisible, ssNode.worldVisible);

  // sNode.visible = true;
  // node.visible = false;

  // console.log('test visibility 2', node.worldVisible, sNode.worldVisible, ssNode.worldVisible);

  // node.visible = true;

  // console.log('test visibility 3', node.worldVisible, sNode.worldVisible, ssNode.worldVisible);

  // ssNode.visible = false;

  // console.log('test visibility 4', node.worldVisible, sNode.worldVisible, ssNode.worldVisible);
  // return;
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

  const wireframeB = new WireframePass(renderer, 2048, 2048, module);
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
  const cam2 = new WasmCamera();

  cam.perspective(90, 1, 5, 50);
  cam2.perspective(70, renderer.width / renderer.height);

  cam.transform.setPosition(25, 25, 25);
  cam2.transform.setPosition(0, 0, 10);

  const camMovVec = vec3.create();
  const camSpeed = 0.1;
  const camRotationEuler = vec3.create();

  const ident = mat4.create();
  const testCollisionBoundsPosition = vec3.create();
  const testCollisionBoundsSize = vec3.fromValues(5, 5, 5);

  const testCollistionBounds = box.setCenterSize(
    allocateTypedArray(Float32Array, 6, module) as box,
    testCollisionBoundsPosition,
    testCollisionBoundsSize,
  );

  // const bounds2 = box.setCenterSize(
  //   allocateTypedArray(Float32Array, 6, module) as box,
  //   vec3.fromValues(4, 1, 1),
  //   vec3.fromValues(1, 1, 1),
  // );

  const colorRed = vec4.set(allocateTypedArray(Float32Array, 4, module) as vec4, 1, 0, 0, 0.7);
  const colorGreen = vec4.set(allocateTypedArray(Float32Array, 4, module) as vec4, 0, 1, 0, 0.7);

  // const createTree: (
  //   boundsPtr: number,
  //   maxLevel: number,
  //   maxElement: number,
  //   parentPtr: number,
  // ) => Number = module.cwrap('OctoTree_create', 'number', ['number', 'number', 'number', 'number']);

  // const treePr = module.ccall('prepareTree', 'number', [], []);
  const treeGridPr = module.ccall('prepareTreeGrid', 'number', [], []);

  const debugCollidedTree: (
    passPtr: number,
    gridPtr: number,
    boxPtr: number,
  ) => void = module.cwrap('debugCollidedTree', null, ['number', 'number', 'number']);
  const debugCollidedTreeBounds: (
    passPtr: number,
    gridPtr: number,
    boxPtr: number,
  ) => void = module.cwrap('debugCollidedTreeBounds', null, ['number', 'number', 'number']);

  const debugFustrum: (passPtr: number, boundsPtr: number, camPtr: number) => void = module.cwrap(
    'debugFustrum',
    null,
    ['number', 'number', 'number'],
  );

  const nbBounds = 4;
  const boundsCPtr = module._malloc(nbBounds * Uint32Array.BYTES_PER_ELEMENT);
  const bounds = new Uint32Array(module.HEAP16.buffer, boundsCPtr, 4);

  const boundsMoveSpeed = 0.1;

  // const bounds: box[] = new Array(nbBounds);
  for (let i = 0; i < nbBounds; i++) {
    bounds[i] = module._malloc(box.byteLength * nbBounds);
    const bound = new Float32Array(module.HEAP16.buffer, bounds[i], 6);
    box.set(bound, i * 3, i * 3 + 1, 0, 2, 0, 2);
  }

  function render() {
    window.requestAnimationFrame(render);

    renderer.clear();

    camRotationEuler[0] += 0.004;
    // camRotationEuler[1] += 0.0013;
    // camRotationEuler[2] += 0.002;

    cam.transform.setEulerRotation(camRotationEuler[0], camRotationEuler[1], camRotationEuler[2]);

    cam2.transform.setEulerRotation(
      (-mouseState.y / window.innerHeight) * Math.PI + Math.PI / 2,
      (-mouseState.x / window.innerWidth) * Math.PI * 2 + Math.PI,
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

    if (keyState.axeXM) testCollisionBoundsPosition[0] -= boundsMoveSpeed;
    if (keyState.axeXP) testCollisionBoundsPosition[0] += boundsMoveSpeed;
    if (keyState.axeYM) testCollisionBoundsPosition[1] -= boundsMoveSpeed;
    if (keyState.axeYP) testCollisionBoundsPosition[1] += boundsMoveSpeed;
    if (keyState.axeZM) testCollisionBoundsPosition[2] -= boundsMoveSpeed;
    if (keyState.axeZP) testCollisionBoundsPosition[2] += boundsMoveSpeed;

    box.setCenterSize(testCollistionBounds, testCollisionBoundsPosition, testCollisionBoundsSize);

    vec3.transformQuat(camMovVec, camMovVec, cam2.transform.rotation);
    cam2.transform.translateVec(camMovVec);

    cam2.wasmUpdateWorldMat(null, false);
    cam.wasmUpdateWorldMat(null, false);

    cam2.mvp(ident, wireframeB.mvp);
    wireframeB.begin();

    // console.log('WireframePass ', WireframePass.byteLength);

    // wireframeB._wasmPushOctoTreeGrid(treeGridPr, colorRed.byteOffset, 1.5);
    // debugCollidedTreeBounds(wireframeB.ptr, treeGridPr, cam.ptr);
    debugCollidedTree(wireframeB.ptr, treeGridPr, cam.ptr);
    // debugFustrum(wireframeB.ptr, testCollistionBounds.byteOffset, cam.ptr);
    // wireframeB.pushBox(testCollistionBounds, colorGreen);
    wireframeB._wasmPushCamera(cam.ptr, colorGreen.byteOffset);

    wireframeB.end();
  }

  render();
});
