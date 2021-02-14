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
import { SimpleTextureShader, SimpleTextureShaderID, SimpleTextureShaderState } from './shaders/SimpleTextureShader';
import { SimpleLamberianShader } from './shaders/SimpleLamberianShader';
import { MSDFShader } from './shaders/MSDFShader';
import { TestFlatMaterial } from './app/materials/TestFlatMaterial';
import { CubeMapPatronHelper } from './geom/CubeMapPatronHelper';
import { IrradianceHelper } from './geom/IrradianceHelper';
import { IrradianceShader } from './app/shaders/TestIrradianceShader';
import { SkyboxMaterial } from './3d/Material/SkyboxMaterial';
import { SkyboxShader } from './shaders/SkyboxShader';
import {
  PlaneSpaceToModelSpaceNormalShader,
  PlaneSpaceToModelSpaceNormalShaderState,
} from './shaders/PlaceSpaceToModelSpaceNormalShader';
import { LambertVShader, TestVariantShaderMaterial } from './app/shaders/VariantShaderTest';
import { mat3, mat4, quat, vec3 } from 'gl-matrix';
import { TestFlatShader } from './app/shaders/TestFlatShader';
import { convertPlaceSpaceToModelSpaceNormalMap } from './app/helpers/convertPlaceSpaceToModelSpaceNormalMap';
import { PhongBlinnShaderDebug, PhongBlinnVShader } from './shaders/PhongBlinnVShader';
import { createSkyBoxMesh } from './geom/mesh/createSkyBoxMesh';
import { createSphereMesh } from './geom/mesh/createSphereMesh';
import { createPlaneMesh } from './geom/mesh/createPlaneMesh';
import { createCylinderMesh } from './geom/mesh/createCylinderMesh';
import { createBoxMesh, cubeSquarePatronUv } from './geom/mesh/createBoxMesh';
import { IRenderableInstance3D } from './3d/IRenderableInstance3D';
import { Camera } from './3d/Camera';
import { PhongBlinnMaterial } from './3d/Material/PhongBlinnMaterial';
import { DepthOnlyShader } from './shaders/DepthOnlyShader';
import { DepthOnlyMaterial } from './3d/Material/DepthOnlyMaterial';
import { createQuadMesh } from './geom/mesh/createQuadMesh';
import { GLMesh } from './gl/core/data/GLMesh';
import { IGLShaderState } from './gl/core/shader/IGLShaderState';
import { BasicTextureShader, BasicTextureShaderID, BasicTextureShaderState } from './shaders/BasicTextureShader';
import { CameraLookAtTransform3D } from './geom/CameraTargetTransform3D';
import { ShadowMap } from './3d/ShadowMap';
import { ShadowOnlyMaterial } from './3d/Material/ShadownOnlyMaterial';
import { ShadowOnlyShader } from './shaders/ShadowOnlyShader';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _corsetNode: GLTFNode;
  private _modelSpaceFramebuffer: GLFramebuffer;

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
  private _lcam: Camera<CameraLookAtTransform3D>;
  private _quad: GLMesh;
  private _quadSS: BasicTextureShaderState;
  private _shadowMap: ShadowMap;
  private _shadowMat: ShadowOnlyMaterial;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.cubeTransform = new Transform3D();

    this._cam.transform.setPosition(0, 0, 3);

    // this.loadScene();
    this.loadScene().then(() => {
      this._lcam = new Camera(CameraLookAtTransform3D).setPerspective(
        70,
        this._renderer.width / this._renderer.height,
        0.1,
        100,
      );
      this._lcam.transform.setPosition(0, 0, 2);
      // this._lcam.transform.setTargetPosition(0,0,0);
      this._camController = new FirstPersonCameraController(this._cam, this._renderer.canvas, 0.06, 0.002);
      this.start();
    });
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
    DepthOnlyShader.register(renderer);
    BasicTextureShader.register(renderer);
    ShadowOnlyShader.register(renderer);
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
    const corsetModelSpaceNormalMap = convertPlaceSpaceToModelSpaceNormalMap(
      this._renderer,
      corsetMesh.vaos[0],
      corsetMesh.primitives[0].nbElements,
      corsetNormalMap,
    );

    this._shadowMap = new ShadowMap(this.renderer,1024,1024,3,0.001,10);
    this._shadowMap.setPosition(2, 2, 2);
    this._shadowMap.setLookAt(-1, -1, -1);

    this._shadowMat = new ShadowOnlyMaterial(this._renderer,this._shadowMap);


    // this._shadowFB = new GLFramebuffer(gl, 512, 512, true, false, true, false);
    // this._shadowCam = new Camera(CameraLookAtTransform3D).setOrtho(-3, 3, -3, 3, 0.001, 5);
    // this._shadowCam.transform.setPosition(2, 2, 2);
    // this._shadowCam.transform.setLookAt(-1, -1, -1);

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
      direction: vec3.normalize(vec3.create(), vec3.fromValues(-1, -1, -1)),
      color: vec3.fromValues(0.4, 0.4, 0.4),
      specularColor: vec3.fromValues(0.3, 0.3, 0.3),
      shininess: 32.0,
      ambiantColor: vec3.fromValues(0.7, 0.7, 0.7),
    };

    // this._shadowCam.transform.copyLookAt(light.direction);

    const phongBlinnMaterial = new PhongBlinnMaterial(this._renderer, light);

    phongBlinnMaterial.normalMap = corsetNormalMap;
    phongBlinnMaterial.tbnEnabled = true;
    phongBlinnMaterial.diffuseMap = textures[0];

    // phongBlinnMaterial.debug = PhongBlinnShaderDebug.shadow;

    // phongBlinnMaterial.normalMap = corsetModelSpaceNormalMap;
    // phongBlinnMaterial.tbnEnabled = false;

    // enable ambiant occlusionMap
    phongBlinnMaterial.extraMap = corsetPbrMap;
    phongBlinnMaterial.occlusionMapEnabled = true;

    // phongBlinnMaterial.debug = PhongBlinnShaderDebug.ambiant

    // corsetMaterial.shadeMode = 'fragment';
    // corsetMaterial.extraColor = 'green';
    // vec3.set(corsetMaterial.lightPos,5,10,5);

    this._corsetNode = new GLTFNode(corsetMesh, phongBlinnMaterial, gltfData.nodes[0]);
    this._corsetNode.transform.setScale(20);
    this._corsetNode.transform.setPosition(0, -0.5, 0);

    // cubemap size
    const bufferSize = 512;
    const cubeMapPatron = await GLTexture.loadTexture2D(this._renderer.gl, './images/circus/hdri/StandardCubeMap.png');
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

    this._quad = createQuadMesh(gl);
    this._quadSS = this.renderer.getShader(BasicTextureShaderID).createState() as BasicTextureShaderState;

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
    const depthMaterial = new DepthOnlyMaterial(this._renderer);

    const cubePatronTexture = await GLTexture.loadTexture2D(gl, 'images/base-cube-patron.jpg');

    const sphereMesh = createSphereMesh(gl, 1, 64, 32);
    const cylinderMesh = createCylinderMesh(gl, 1, 1, 1, 32, 1);
    const cubeMesh = createBoxMesh(gl, 1, 1, 1, 3, 3, 3, cubeSquarePatronUv);
    const sphereMat = new PhongBlinnMaterial(this._renderer, light);
    sphereMat.diffuseMap = cubePatronTexture;
    sphereMat.irradianceMap = this._irradianceHelper.framebufferTexture;
    this._sphere = new MeshNode(sphereMat, cubeMesh);
    this._sphere.transform.translate(0.5, 1, 1);


    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0 , 0);
    plane.transform.setScale(5);
    plane.transform.setPosition(0,-1,0);

    this._sceneRenderables = new SceneInstance3D();

    sphereMat.shadowMap = this._shadowMap;
    // sphereMat.debug = PhongBlinnShaderDebug.shadow;
    phongBlinnMaterial.shadowMap = this._shadowMap;

    // this._shadowCam.transform.setPosition(-10,-10,-10);
    // quat.rotationTo(this._shadowCam.transform.getRawRotation(), this._sphere.transform.getRawPosition(), this._shadowCam.transform.getRawPosition());

    [this._skybox, this._sphere, this._corsetNode, plane].forEach((node) => this._sceneRenderables.addChild(node));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._corsetNode.transform.rotateEuler(0, elapsedTime * 0.001, 0);

    // const camQuat = this._cam.transform.getRawRotation();

    // // console.log('camQuat',camQuat);
    // const diff = vec3.create();

    // vec3.normalize(diff, this._cam.transform.getRawPosition());

    // quat.rotationTo(camQuat,vec3.fromValues(0,0,-1), diff);

    // this._cam.transform.rotationTo(vec3.create());
    // this._lcam.transform.translate(0.01,0,0);
    this._cam.updateTransform();
    this._lcam.updateTransform();

    this._shadowMap.updateTransform();

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
    const renderer = this._renderer;
    const gl = this._renderer.gl;

    // this._shadowFB.bind();
    // // renderable.
    // this._renderer.clear();
    // this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._shadowCam));
    // this._shadowFB.unbind();


    this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());


    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));


    // this._quadSS.use();
    // this._shadowMap.depthTexture.active(0);
    // // mat4.identity(this._quadSS.mvp);
    // this._quadSS.syncUniforms();
    // this._quad.draw();
    // this._shadowFB.colorTexture.unbind();


  }

  renderElement(renderable: IRenderableInstance3D) {
    // renderable.render(this._renderer.gl, this._shadowCam as any);
    // this._shadowFB.unbind();

    // this._shadowFB.colorTexture.active(0);
    // mat4.identity(this._quadSS.mvp);
    // this._quadSS.use();
    // this._quadSS.syncUniforms();
    // this._quad.draw();
  }
}
