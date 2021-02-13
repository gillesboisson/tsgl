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
import { MeshNode, SceneInstance3D } from './3d/SceneInstance3D';
import { Base3DApp } from './app/Base3DApp';
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
import { TestFlatMaterial } from './app/materials/TestFlatMaterial';
import { CubeMapPatronHelper } from './geom/CubeMapPatronHelper';
import { IrradianceHelper } from './geom/IrradianceHelper';
import { IrradianceShader } from './app/shaders/TestIrradianceShader';
import { SkyboxMaterial } from './3d/Material/SkyboxMaterial';
import { SkyboxShader } from './shaders/SkyboxShader';
import { PlaneSpaceToModelSpaceNormalShader, PlaneSpaceToModelSpaceNormalShaderState } from './shaders/PlaceSpaceToModelSpaceNormalShader';
import { LambertVShader, TestVariantShaderMaterial } from './app/shaders/VariantShaderTest';
import { vec3 } from 'gl-matrix';
import { TestFlatShader } from './app/shaders/TestFlatShader';
import { convertPlaceSpaceToModelSpaceNormalMap } from './app/helpers/convertPlaceSpaceToModelSpaceNormalMap';
import { PhongBlinnVMaterial, PhongBlinnVShader } from './shaders/PhongBlinnVShader';
import { createSkyBoxMesh } from './geom/mesh/createSkyBoxMesh';
import { createSphereMesh } from './geom/mesh/createSphereMesh';
import { createPlaneMesh } from './geom/mesh/createPlaneMesh';
import { createCylinderMesh } from './geom/mesh/createCylinderMesh';
import { createBoxMesh, cubeSquarePatronUv } from './geom/mesh/createBoxMesh';
import { IRenderableInstance3D } from './3d/IRenderableInstance3D';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _corsetNode: GLTFNode;private _modelSpaceFramebuffer: GLFramebuffer;

  private _camController: FirstPersonCameraController;
  private _cubeMap: GLTexture;
  fb: GLFramebuffer;
  vps: GLViewportStack;
  private _flatMat: TestFlatMaterial;
  cubePHelper: CubeMapPatronHelper;
  private _cubeMapPatron: GLTexture;
  private _irradianceHelper: IrradianceHelper;
  private _skybox: MeshNode;
  private _ppTomsNormal: PlaneSpaceToModelSpaceNormalShaderState;
  private _sphere: MeshNode;
  private _sceneRenderables: SceneInstance3D;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    this._cam.transform.setPosition(0, 0, -2);

    // this.loadScene();
    this.loadScene().then(() => this.start());

    this._camController = new FirstPersonCameraController(this._cam, this._renderer.canvas, 0.06, 0.002);
  }


  registeShader(gl: WebGL2RenderingContext, renderer: GLRenderer) {
    SimpleTextureShader.register(renderer);
    SimpleLamberianShader.register(renderer);
    TestFlatShader.register(renderer);
    MSDFShader.register(renderer);
    // PhongBlinnShader.register(renderer);
    PhongBlinnVShader.register(renderer);
    IrradianceShader.register(renderer);
    SkyboxShader.register(renderer);
    PlaneSpaceToModelSpaceNormalShader.register(renderer);
    LambertVShader.register(renderer);
  }

  async loadTexture(): Promise<void> {}

  protected async loadScene(): Promise<void> {
    const gl = this._renderer.gl;

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

    const corsetMesh = createMesh(gl, gltfData.meshes[0], gltfData.accessors, gltfData.bufferViews, glBuffers);
    const corsetNormalMap = textures[2];
    const corsetPbrMap = textures[1];
    const corsetModelSpaceNormalMap = convertPlaceSpaceToModelSpaceNormalMap(this._renderer,corsetMesh.vaos[0],corsetMesh.primitives[0].nbElements,corsetNormalMap);
    


    // const corsetMaterial =  new SimpleLamberianMaterial(this._renderer, textures[0], textures[2], textures[1]);
    // const corsetMaterial =  new TestVariantShaderMaterial(this._renderer);

    // const phongBlinnMaterial = new PhongBlinnVMaterial(this._renderer, corsetModelSpaceNormalMap, {
    //   position: vec3.fromValues(10,10,10),
    //   color: vec3.create(),
    //   specularColor: vec3.create(),
    //   shininess: 0.0,
    //   ambiantColor: vec3.fromValues(1,1,1),
    // });
    
    
    const light = {
      direction: vec3.normalize(vec3.create(),vec3.fromValues(1,1,1)),
      color: vec3.fromValues(0.4,0.4,0.4),
      specularColor: vec3.fromValues(0.8,0.8,0.8),
      shininess: 64.0,
      ambiantColor: vec3.fromValues(0.7,0.7,0.7),
    };

    const phongBlinnMaterial = new PhongBlinnVMaterial(this._renderer, light);


    phongBlinnMaterial.normalMap = corsetNormalMap;
    phongBlinnMaterial.tbnEnabled = true;
    phongBlinnMaterial.diffuseMap = textures[0];
    
    // phongBlinnMaterial.normalMap = corsetModelSpaceNormalMap;
    // phongBlinnMaterial.tbnEnabled = false;
    
    // enable ambiant occlusionMap
    phongBlinnMaterial.extraMap = corsetPbrMap;
    phongBlinnMaterial.occlusionMapEnabled = true;


    // corsetMaterial.shadeMode = 'fragment';
    // corsetMaterial.extraColor = 'green';
    // vec3.set(corsetMaterial.lightPos,5,10,5);

    this._corsetNode = new GLTFNode(
      corsetMesh,
      phongBlinnMaterial,
      gltfData.nodes[0],
    );
    this._corsetNode.transform.setScale(20);
    this._corsetNode.transform.setPosition(0, -0.5, 0);


   

    // cubemap size
    const bufferSize = 512;
    const cubeMapPatron = await GLTexture.loadTexture2D(this._renderer.gl, './images/circus/hdri/test_cmap.jpeg');
    this.cubePHelper = new CubeMapPatronHelper(this.renderer, bufferSize);
    this.cubePHelper.unwrap(cubeMapPatron);

    this._irradianceHelper = new IrradianceHelper(this.renderer, bufferSize);
    this._irradianceHelper.unwrap(this.cubePHelper.framebufferTexture);

    // create skybox
    this._skybox = new MeshNode(
      new SkyboxMaterial(this._renderer, this.cubePHelper.framebufferTexture),
      createSkyBoxMesh(this._renderer.gl),
    );

    this._skybox.transform.setScale(50);



    phongBlinnMaterial.irradianceMap = this._irradianceHelper.framebufferTexture;
    
    // this._ppTomsNormal = this._renderer.getShader(PlaneSpaceToModelSpaceNormalShaderID).createState() as PlaneSpaceToModelSpaceNormalShaderState;
    // this._modelSpaceFramebuffer = new GLFramebuffer(gl,corsetNormalMap.width,corsetNormalMap.height,false,true,false,false);
    // const normalImageData = new Uint8Array(corsetNormalMap.width * corsetNormalMap.height * 4);

    // this._modelSpaceFramebuffer.bind();
    // // const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
    // // const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);

    // gl.disable(gl.CULL_FACE);
    // this._ppTomsNormal.use();
    // corsetMesh.vaos[0].bind();
    // textures[2].active(GLDefaultTextureLocation.NORMAL);
    // gl.drawElements(gl.TRIANGLES,corsetMesh.primitives[0].nbElements,gl.UNSIGNED_SHORT,0);
    

    // gl.enable(gl.CULL_FACE);
    // this._modelSpaceFramebuffer.unbind();


    // gl.bindFramebuffer(gl.FRAMEBUFFER, this._modelSpaceFramebuffer.glFrameBuffer);
    // // gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,normalImageData);
    // gl.bindFramebuffer(gl.FRAMEBUFFER,null);

    // setTimeout(() => console.log(normalImageData),2000);

    const cubePatronTexture = await GLTexture.loadTexture2D(gl, 'images/base-cube-patron.jpg');

    const sphereMesh = createSphereMesh(gl,1,64,32);
    const cylinderMesh = createCylinderMesh(gl,1,1,1,32,1);
    const planeMesh = createPlaneMesh(gl);
    const cubeMesh = createBoxMesh(gl,1,1,1,3,3,3,cubeSquarePatronUv);
    const sphereMat = new PhongBlinnVMaterial(this._renderer,light);
    sphereMat.diffuseMap =cubePatronTexture;
    sphereMat.irradianceMap = this._irradianceHelper.framebufferTexture;
    this._sphere = new MeshNode(sphereMat,cubeMesh);


    this._sceneRenderables = new SceneInstance3D();


    [this._skybox,this._sphere,this._corsetNode].forEach((node) => this._sceneRenderables.addChild(node));

    

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._corsetNode.transform.rotateEuler(0, elapsedTime * 0.001, 0);
    this._cam.updateTransform();
    this._sceneRenderables.updateTransform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.stop();


    // this._irradianceHelper.framebufferTexture.active(9);
    // this._renderer.gl.viewport(0, 0, 1280, 720);

    // this._skybox.render(this._renderer.gl,this._cam);
    // this._corsetNode.render(this._renderer.gl, this._cam);
    // this._sphere.render(this._renderer.gl,this._cam);

    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => this.renderElement(node));

  }

  renderElement(renderable: IRenderableInstance3D){
    renderable.render(this._renderer.gl,this._cam);
  }
}
