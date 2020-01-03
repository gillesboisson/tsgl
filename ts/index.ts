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
let spector: any = null;

const nbElements = 128;
loader.load('em_app.js').then((module) => {
  const renderer: BaseRenderer = GLRenderer.createFromCanvas<BaseRenderer>(
    document.getElementById('test') as HTMLCanvasElement,
    GLRendererType.WebGL2,
    BaseRenderer,
  );

  const collectionQueue = new QueuePassCollection(module);
  collectionQueue.addQueuePass('node', new NodePass(renderer, 32, module));

  const nodeQ = collectionQueue.getQueuePass('node');

  console.log('nodeQ : ', nodeQ);
  collectionQueue.printWasm();

  return;
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

  const testPass = new MyPass(renderer);

  module.ccall('testRenderingPass', null, ['number'], [testPass.ptr]);

  const wireframeB = new WireframePass(renderer, 8, 12, module);
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

  // batch.push = () => console.log(batch);

  // module.ccall('testBatch', null, ['number'], [batch.ptr]);

  // const vao = new GLVao(gl, []);
  // console.log('gl : ', gl, vao);

  /*
  const batch = new WasmVertexElementBatch(PositionColor, 32, 32, module);
  function pull(vertexInd: number, collection: PositionColor[], indInd: number, indexBuffer: Uint16Array) {
    // const x = Math.random() * 2 + 1;
    // const y = Math.random() * 2 + 1;
    // const z = Math.random() * 2 + 1;
    const x = 0;
    const y = 0;
    const z = 0;

    for (let i = 0; i < 4; i++) {
      const element = collection[i + vertexInd];
      vec4.set(element.color, 1, 0, 1, 1);
    }

    vec3.set(collection[vertexInd].position, x - 0.5, y - 0.5, z);
    vec3.set(collection[vertexInd + 1].position, x + 0.5, y - 0.5, z);
    vec3.set(collection[vertexInd + 2].position, x - 0.5, y + 0.5, z);
    vec3.set(collection[vertexInd + 3].position, x + 0.5, y + 0.5, z);

    indexBuffer[indInd] = vertexInd + 0;
    indexBuffer[indInd + 1] = vertexInd + 1;
    indexBuffer[indInd + 2] = vertexInd + 1;
    indexBuffer[indInd + 3] = vertexInd + 3;
    indexBuffer[indInd + 4] = vertexInd + 3;
    indexBuffer[indInd + 5] = vertexInd + 2;
    indexBuffer[indInd + 6] = vertexInd + 2;
    indexBuffer[indInd + 7] = vertexInd + 0;
  }

  const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW, batch.vertexBuffer);
  const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.DYNAMIC_DRAW, batch.indexBuffer);
  const vao = new GLVao(gl, PositionColor.createAttributes(gl, vertexBuffer), indexBuffer);

  const shader = new WireframeShader(gl);
  const wireframeShaderState = shader.createState();

  batch.push = () => {
    // console.log('> push', batch.indexInd);
    wireframeShaderState.start();
    indexBuffer.bufferSubData();
    vertexBuffer.bufferSubData();
    vao.bind();
    gl.drawElements(gl.LINES, batch.indexInd, gl.UNSIGNED_SHORT, 0);
    vao.unbind();
  };
  */

  /*
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

  const mesh = new GLMesh(gl, 8, 12, attributes, indicesBuffer);

  mesh.setInstanced(128);

  const shader = new BasicShader(gl);
  const shaderState = shader.createState();

  const nodesB = new WasmStructBuffer(WasmSceneNode, nbElements);
  const resultsB = new WasmStructBuffer(WasmSceneNodeResult, nbElements);

  const nodes = nodesB.collection;
  const results = resultsB.collection;

  for (let index = 0; index < nbElements; index++) {
    nodes[index].transform.setPosition(Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25);
  }

  // const nodeResultData = new WasmSceneNodeResult();

  const buffer = new GLBuffer(gl, gl.UNIFORM_BUFFER, gl.DYNAMIC_COPY, resultsB.buffer);
  const ubo = new GLUbo(gl, shader.getProgram(), 'transform', 0);

  const batchNodes: (
    ptrCam: number,
    ptrNodeBuffer: number,
    ptrResultBuffer: number,
  ) => void = module.cwrap('batchNodes', null, ['number', 'number', 'number']);

  const cam = new WasmCamera();

  cam.perspective(70, renderer.width / renderer.height);

  cam.transform.setPosition(0, 0, 10);

  const camMovVec = vec3.create();
  const camSpeed = 0.1;

  // const node = new WasmSceneNode();
  */

  function render() {
    window.requestAnimationFrame(render);

    renderer.clear();

    wireframeB.begin();

    wireframeB.pull(4, 8, pullV);

    wireframeB.end();

    // batch.begin();
    // for (let i = 0; i < 32; i++) {
    //   batch.pull(4, 8, pull);
    // }
    // batch.end();

    /*
    if (watching) console.log('--------------------------------------------------------');
    for (let index = 0; index < nodes.length; index++) {
      nodes[index].transform.rotateEuler(0, 0.01, 0);
      // nodes[index].transform.translate(0, 0.01, 0);
    }
    batchNodes(cam.ptr, nodesB.ptr, resultsB.ptr);

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
    // node.wasmUpdateWorldMat(null, false);

    // node.transform.rotateEuler(0, 0.01, 0);

    // cam.mvp(node.worldMat, shaderState.mvp);
    // cam.mvp(node.worldMat, nodeResults.collection[0].mvp);
    shaderState.use();
    // shaderState.syncUniforms();

    // buffer.bind();
    ubo.bindBufferBase(buffer);
    buffer.bufferSubData();
    // gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);

    // gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffer);

    // gl.bufferSubData(gl.UNIFORM_BUFFER, 0, nodeResultData.memoryBuffer, 0);
    // gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    mesh.draw();
    */
  }

  render();
});
