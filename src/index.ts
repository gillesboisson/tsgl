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
import { IRenderableInstance3D } from './3d/IRenderableInstance3D';
import { SimpleLamberianMaterial } from './3d/Material/SimpleLamberianMaterial';
import { SimpleTextureMaterial } from './3d/Material/SimpleTextureMaterial';
import { MeshNode } from './3d/SceneInstance3D';
import { Base3DApp } from './app/Base3DApp';
import { createQuadMesh, createUVCropMesh } from './geom/MeshHelpers';
import { Transform3D } from './geom/Transform3D';
import { GLBuffer } from './gl/core/data/GLBuffer';
import { GLVao } from './gl/core/data/GLVao';
import { GLFramebuffer } from './gl/core/framebuffer/GLFramebuffer';
import { GLViewportStack } from './gl/core/framebuffer/GLViewportState';
import { GLRenderer } from './gl/core/GLRenderer';
import { GLTexture } from './gl/core/GLTexture';
import { FirstPersonCameraController } from './input/CameraController';
import { SimpleTextureShader } from './shaders/SimpleTextureShader';
import { SimpleLamberianShader } from './shaders/SimpleLamberianShader';
import { MSDFShader } from './shaders/MSDFShader';
import { TestFlatID, TestFlatShader, TestFlatShaderState } from './app/shaders/TestFlatShader';
import { TestFlatMaterial } from './app/materials/TestFlatMaterial';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _node: IRenderableInstance3D;
  private _camController: FirstPersonCameraController;
  private _cubeMap: GLTexture;
  fb: GLFramebuffer;
  vps: GLViewportStack;
  quad: import('/home/gilles/Projects/sandbox/TsGL2D/src/gl/core/data/GLMesh').GLMesh;
  private _flatMat: TestFlatMaterial;
  private _flatShaderState: TestFlatShaderState;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    // this.cubeTransform.setPosition(0, 0, -10);
    this._cam.transform.setPosition(0, 0, -10);

    this.loadScene().then(() => this.start());

    this._camController = new FirstPersonCameraController(this._cam, this._renderer.canvas, 0.06, 0.002);

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
    const gl = this._renderer.getGL();

    const dir = './models/Corset/glTF';

    const gltfData: GLTFData = await fetch(`${dir}/Corset.gltf`).then((response) => response.json());
    // setBufferViewTargetFromMesh(gl, gltfData);

    // const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    // await loadBuffers(gltfData, dir, (ind, buffer) => {
    //   getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
    //     glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
    //   });
    // });

    const textures = await loadTextures(gl, gltfData, dir);

    // const mesh = createMesh(gl, gltfData.meshes[0], gltfData.accessors, gltfData.bufferViews, glBuffers);

    // // this._node = new GLTFNode(mesh, new SimpleLamberianMaterial(this._renderer, textures[2]), gltfData.nodes[0]);

    const xQ = 1 / 4;
    const yT = 1 / 3;

    const xS = new Array(5);
    const yS = new Array(4);

    for (let i = 0; i < xS.length; i++) {
      xS[i] = i / 4;
    }

    for (let i = 0; i < yS.length; i++) {
      yS[i] = 1 - i / 3;
    }

    const x0 = 0;
    const x1 = xQ;
    const x2 = xQ * 2;
    const x3 = xQ * 3;
    const x4 = 1;

    const y0 = 1;
    const y1 = yT * 2;
    const y2 = yT;
    const y3 = 0;

    this.quad = createUVCropMesh(
      gl,
      new Float32Array([
        -1, -1, -0.5, -1, -1, -0.5, -0.5, -0.5,
        -0.5, -1, -0, -1, -0.5, -0.5, -0, -0.5,
      ]),
      new Float32Array([
        xS[0], yS[1], xS[1], yS[1], xS[0], yS[2], xS[1], yS[2],
        xS[1], yS[1], xS[2], yS[1], xS[1], yS[2], xS[2], yS[2],
      ]),
    );

    this._node = new MeshNode(new SimpleTextureMaterial(this._renderer, textures[0]), this.quad);

    const bufferSize = 512;

    this.fb = new GLFramebuffer(gl, bufferSize, bufferSize, false, true, true, false);

    this.vps = new GLViewportStack(gl, this._renderer);

    // this._flatMat = new TestFlatMaterial(this._renderer, textures[0]);

    this._flatShaderState = this._renderer.getShader(TestFlatID).createState() as TestFlatShaderState;

    const cubeMapPatron = await GLTexture.loadTexture2D(
      this._renderer.getGL(),
      './images/circus/hdri/StandardCubeMap.png',
    );
    cubeMapPatron.active();

    // this._node.transform.setScale(20);
    // this._node.transform.setPosition(0, -0.5, 0);

    // this._cubeMap = await GLTexture.loadCubeMap(gl, [
    //   './images/circus/hdri/px.png',
    //   './images/circus/hdri/nx.png',
    //   './images/circus/hdri/py.png',
    //   './images/circus/hdri/ny.png',
    //   './images/circus/hdri/pz.png',
    //   './images/circus/hdri/nz.png',
    // ]);

    // this._cubeMap.active(9);

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
    SimpleTextureShader.register(renderer);
    SimpleLamberianShader.register(renderer);
    MSDFShader.register(renderer);
    TestFlatShader.register(renderer);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._node.transform.rotateEuler(0, elapsedTime * 0.001, 0);
    this._cam.updateWorldMat();
    this._node.updateWorldMat();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.stop();

    this._flatShaderState.use();

    this.quad.draw();

    // this.fb.bind();

    // this._node.render(this._renderer.getGL(), this._cam);
    // this.flatShaderState.use();
    // this._cam.mvp(this.flatShaderState.mvp, this.cubeTransform.getLocalMat(), false);
    // this.flatShaderState.syncUniforms();
    // this.meshVao.bind();
    // const gl = this._renderer.getGL();
    // gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0);
  }
}
