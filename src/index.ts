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
import { createQuadMesh, createSkyBoxMesh, createUVCropMesh } from './geom/MeshHelpers';
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
import { CubeMapPatronHelper } from './geom/CubeMapPatronHelper';
import { IrradianceHelper } from './geom/IrradianceHelper';
import { IrradianceShader } from './app/shaders/TestIrradianceShader';
import { SkyboxMaterial } from './3d/Material/SkyboxMaterial';
import { SkyboxShader } from './shaders/SkyboxShader';

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
  private _flatMat: TestFlatMaterial;
  private _flatShaderState: TestFlatShaderState;
  cubePHelper: CubeMapPatronHelper;
  private _cubeMapPatron: GLTexture;
  private _irradianceHelper: IrradianceHelper;
  private _skybox: MeshNode;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    // this.cubeTransform.setPosition(0, 0, -10);
    this._cam.transform.setPosition(0, 0, -2);

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
    setBufferViewTargetFromMesh(gl, gltfData);

    const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    await loadBuffers(gltfData, dir, (ind, buffer) => {
      getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
        glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
      });
    });

    const textures = await loadTextures(gl, gltfData, dir);

    const mesh = createMesh(gl, gltfData.meshes[0], gltfData.accessors, gltfData.bufferViews, glBuffers);

    this._node = new GLTFNode(
      mesh,
      new SimpleLamberianMaterial(this._renderer, textures[0], textures[2], textures[1]),
      gltfData.nodes[0],
    );
    this._node.transform.setScale(20);
    this._node.transform.setPosition(0, -0.5, 0);

    // this._node = new MeshNode(new SimpleTextureMaterial(this._renderer, textures[0]), this.quad);

    const bufferSize = 512;

    this._flatShaderState = this._renderer.getShader(TestFlatID).createState() as TestFlatShaderState;

    const cubeMapPatron = await GLTexture.loadTexture2D(this._renderer.getGL(), './images/circus/hdri/test_cmap.jpeg');

    this.cubePHelper = new CubeMapPatronHelper(this.renderer, bufferSize);
    this.cubePHelper.unwrap(cubeMapPatron);

    this._irradianceHelper = new IrradianceHelper(this.renderer, bufferSize);
    this._irradianceHelper.unwrap(this.cubePHelper.framebufferTexture);

    this._skybox = new MeshNode(
      new SkyboxMaterial(this._renderer, this._irradianceHelper.framebufferTexture),
      createSkyBoxMesh(this._renderer.getGL()),
    );

    this._skybox.transform.setScale(50);

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
    IrradianceShader.register(renderer);
    SkyboxShader.register(renderer);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._node.transform.rotateEuler(0, elapsedTime * 0.001, 0);
    this._cam.updateWorldMat();
    this._node.updateWorldMat();
    this._skybox.updateWorldMat();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.stop();

    // this._flatShaderState.use();

    // this.cubePHelper.meshes[5].draw();

    // this.quad.draw();

    // this.fb.bind();

    this._irradianceHelper.framebufferTexture.active(9);
    this._renderer.getGL().viewport(0, 0, 1280, 720);

    this._skybox.render(this._renderer.getGL(),this._cam);
    this._node.render(this._renderer.getGL(), this._cam);
  }
}
