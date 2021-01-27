import { GLTFData } from './3d/gltf/GLFTSchema';
import { GLTFNode } from './3d/gltf/GLTFNode';
import {
  createMesh,
  getBufferViewsDataLinkedToBuffer,
  loadBuffers,
  loadBufferView,
  loadTexture as loadTextures,
  setBufferViewTargetFromMesh,
} from './3d/gltf/GLTFParser';
import { SimpleLamberianMaterial } from './3d/Material/SimpleLamberianMaterial';
import { SimpleTextureMaterial } from './3d/Material/SimpleTextureMaterial';
import { Base3DApp } from './app/Base3DApp';
import { Transform3D } from './geom/Transform3D';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLVao } from './gl/core/data/GLVao';
import { GLRenderer } from './gl/core/GLRenderer';
import { GLTexture } from './gl/core/GLTexture';
import { SimpleFlatShader } from './shaders/SimpleFlatShader';
import { SimpleLamberianShader } from './shaders/SimpleLamberianShader';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _node: GLTFNode<SimpleLamberianMaterial>;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    // this.cubeTransform.setPosition(0, 0, -10);
    this._cam.transform.setPosition(0, 0, 2);

    this.loadScene().then(() => this.start());

    // const gl = this._renderer.getGL();

    // gl.enable(gl.CULL_FACE);
    // gl.disable(gl.DEPTH_TEST);
  }
  async loadTexture(): Promise<void> {
    // this.flatShaderState = this.renderer.getShader('simple_flat').createState() as SimpleFlatShaderState;
    // this.flatShaderState.textureInd = 0;
    // this.cam.transform.setPosition(0, 0, -10);
    // texture.active(0);
  }

  protected async loadScene(): Promise<void> {
    const dir = './models/Corset/glTF';

    const gltfData: GLTFData = await fetch(`${dir}/Corset.gltf`).then((response) => response.json());
    const gl = this._renderer.getGL();
    setBufferViewTargetFromMesh(gl, gltfData);

    const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    await loadBuffers(gltfData, dir, (ind, buffer) => {
      getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
        glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
      });
    });

    const textures = await loadTextures(gl, gltfData, dir);

    const mesh = createMesh(gl, gltfData.meshes[0], gltfData.accessors, gltfData.bufferViews, glBuffers);

    this._node = new GLTFNode(mesh, new SimpleLamberianMaterial(this._renderer, textures[2]), gltfData.nodes[0]);

    this._node.transform.setScale(20);
    this._node.transform.setPosition(0, -0.5, 0);

    /*
    const primitive = gltfData.meshes[0].primitives[0];

    this.meshVao = primitiveToVao(gl, primitive, gltfData.accessors, gltfData.bufferViews, glBuffers);

    // fetch('./images/test-v.gltf')
    //   .then((response) => response.json())
    //   .then((gltf: GLTFData) => loadBuffers(gltf, './images'))
    //   .then((buffers) => {
    //   });
    */
  }

  registeShader(gl: WebGL2RenderingContext, renderer: GLRenderer) {
    SimpleFlatShader.register(renderer);
    SimpleLamberianShader.register(renderer);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    //
    this._node.transform.rotateEuler(0, elapsedTime * 0.001, 0);
    this._cam.updateWorldMat();
    this._node.updateWorldMat();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    this._node.render(this._renderer.getGL(), this._cam);
    // this.flatShaderState.use();
    // this._cam.mvp(this.flatShaderState.mvp, this.cubeTransform.getLocalMat(), false);
    // this.flatShaderState.syncUniforms();
    // this.meshVao.bind();
    // const gl = this._renderer.getGL();
    // gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);
  }
}
