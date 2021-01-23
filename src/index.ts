import { mat4 } from 'gl-matrix';
import { GLTFData } from './3d/gltf/GLFTSchema';
import {
  getBufferViewsDataLinkedToBuffer,
  loadBuffers,
  loadBufferView,
  primitiveToVao,
  setBufferViewTargetFromMesh,
} from './3d/gltf/GLTFParser';
import { Base3DApp } from './app/Base3DApp';
import { Transform3D } from './geom/Transform3D';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLVao } from './gl/core/data/GLVao';
import { GLRenderer } from './gl/core/GLRenderer';
import { GLTexture } from './gl/core/GLTexture';
import { PositionUv } from './gl/data/PositionUv';
import { SimpleFlatShader, SimpleFlatShaderState } from './shaders/SimpleFlatShader';

window.addEventListener('load', async () => {
  console.log('> hello');

  const app = new TestApp();
});

class TestApp extends Base3DApp {
  flatShaderState: SimpleFlatShaderState;
  meshVao: GLVao;
  cubeTransform: Transform3D;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    // this.cubeTransform.setPosition(0, 0, -10);
    this._cam.transform.setPosition(0, 0, 10);

    this.loadMeshes()
      .then(() => this.loadTexture())
      .then(() => this.start());

    // const gl = this._renderer.getGL();

    // gl.enable(gl.CULL_FACE);
    // gl.disable(gl.DEPTH_TEST);
  }
  async loadTexture(): Promise<void> {
    this.flatShaderState = this.renderer.getShader('simple_flat').createState() as SimpleFlatShaderState;
    const texture = await GLTexture.load(this.renderer.getGL(), 'images/cube-color.png');
    this.flatShaderState.textureInd = 0;

    // this.cam.transform.setPosition(0, 0, -10);

    texture.active(0);
  }

  protected async loadMeshes(): Promise<void> {
    const gltfData: GLTFData = await fetch('./images/test-v.gltf').then((response) => response.json());
    const gl = this._renderer.getGL();
    setBufferViewTargetFromMesh(gl, gltfData);

    console.log('gltfData', gltfData);

    const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    await loadBuffers(gltfData, './images', (ind, buffer) => {
      console.log('< buffer loaded', ind, buffer);
      getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
        glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
      });
    });

    console.log('bufferViews', glBuffers);

    const primitive = gltfData.meshes[0].primitives[0];

    this.meshVao = primitiveToVao(gl, primitive, gltfData.accessors, gltfData.bufferViews, glBuffers);

    // fetch('./images/test-v.gltf')
    //   .then((response) => response.json())
    //   .then((gltf: GLTFData) => loadBuffers(gltf, './images'))
    //   .then((buffers) => {
    //     console.log('buffers', buffers);
    //   });
  }

  registeShader(gl: WebGL2RenderingContext, renderer: GLRenderer) {
    console.log('registeShader');
    SimpleFlatShader.register(renderer);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this.cubeTransform.setRotation(0, time / 25, 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    this.flatShaderState.use();
    this._cam.mvp(this.flatShaderState.mvp, this.cubeTransform.getLocalMat(), false);
    this.flatShaderState.syncUniforms();
    this.meshVao.bind();
    const gl = this._renderer.getGL();

    gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);
  }
}
