import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLShader } from './gl/core/shader/GLShader';
import { getDefaultAttributeLocation, GLDefaultAttributesLocation } from './gl/core/data/GLDefaultAttributesLocation';
import { IInterleavedData, InterleavedDataArray } from './gl/data/InterleavedData';
import { interleavedData, interleavedProp } from './gl/data/InterleavedData.decorator';

import { GLTexture } from './gl/core/GLTexture';
import { GLAttribute } from './gl/core/data/GLAttribute';
import { GLMesh } from './gl/core/data/GLMesh';
import { AGLBatch, GLBatchable, pullMethod } from './gl/core/data/AGLBatch';
import { AnyWebRenderingGLContext } from './gl/core/GLHelpers';
import { GLFramebuffer } from './gl/core/framebuffer/GLFramebuffer';
import { GLInterleavedAttributes } from './gl/core/data/GLInterleavedAttributes';
import { Transform3D } from './geom/Transform3D';
import { SceneInstance3D } from './3d/SceneInstance3D';
import { createQuadMesh } from './geom/MeshHelpers';
import { Camera3D } from './3d/Camera3D';
import { GLAttributesCollection } from './gl/core/data/GLAttributesCollection';
import { cpus } from 'os';
import { SimpleColorShader } from './shaders/SimpleColorShader';
import { GLVariantShader } from './gl/core/shader/variants/GLVariantShader';
import { TestVariantShader, ColorMode } from './shaders/TestVariantShader';
import { TestUBOShader, TestUBOShaderState } from './shaders/TestUboShader';

var SPECTOR = require('spectorjs');

const DEBUG = true;
const DEBUG_COMMANDS_START = true;
let spector: any = null;

if (DEBUG) {
  spector = new SPECTOR.Spector();
}

@GLInterleavedAttributes()
@interleavedData()
class PosUvColor implements IInterleavedData {
  static createAttributes: (gl: AnyWebRenderingGLContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @interleavedProp({
    type: Float32Array,
    length: 3,
    attributeLocation: GLDefaultAttributesLocation.POSITION,
  })
  public position: vec3;

  @interleavedProp({
    type: Float32Array,
    length: 2,
    attributeLocation: GLDefaultAttributesLocation.UV,
  })
  public uv: vec2;

  @interleavedProp({
    type: Float32Array,
    length: 4,
    attributeLocation: GLDefaultAttributesLocation.COLOR,
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
  // const myShader = new SimpleColorShader(gl);
  // const myShaderState = myShader.createState();

  const myVariantShader = new TestVariantShader(gl);
  const myVariantShaderState = myVariantShader.createState();

  const testUboShader = new TestUBOShader(gl);
  const testUboShaderState = testUboShader.createState();

  // const myVariantShader = new TestVariantShader(gl);

  if (DEBUG) {
    spector.displayUI();

    if (DEBUG_COMMANDS_START) spector.captureContext(gl, 100);
  }

  function render() {
    window.requestAnimationFrame(render);
    renderer.clear();

    testUboShaderState.use();
    testUboShaderState.syncUniforms();
    //myVariantShaderState.syncUniforms();

    // myShader.use();
    // myShaderState.use();
    // myShaderState.syncUniforms();
    mesh.draw();
  }

  const img = document.createElement('img') as HTMLImageElement;

  // setTimeout(() =>
  img.addEventListener('load', () => {
    const texture = new GLTexture(gl, gl.TEXTURE_2D, img.width, img.height);
    texture.uploadImage(img, gl.RGB);
    texture.active(0);
    // myShader.getUniforms().textureInd = 0;
    render();
  });
  // }),3000);

  img.src = './images/bb.jpg';
  setTimeout(() => (myVariantShaderState.colorMode = ColorMode.Green), 3000);
});
