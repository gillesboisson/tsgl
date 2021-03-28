/* eslint-disable @typescript-eslint/no-unused-vars */
import { mat4, vec3, vec4 } from 'gl-matrix';

import { Base3DApp } from './app/Base3DApp';
import { createFBAndFlippableTexture } from './tsgl/helpers/texture/createFBAndFlippableTexture';
import { createEmptyMipmapTexture } from './tsgl/helpers/texture/createEmptyMipmapTexture';
import { createMipmapTextureForStorage } from './tsgl/helpers/texture/createMipmapTextureForStorage';
import { createCubemapEmptyTexture } from './tsgl/helpers/texture/createCubemapEmptyTexture';
import { TestFlatMaterial } from './app/materials/TestFlatMaterial';
import { CopyShader, CopyShaderID, CopyShaderState } from './app/shaders/CopyShader';
import { TestBlurShader, TestBlurShaderID, TestBlurShaderState } from './app/shaders/TestBlurShader';
import { TestFlatShader } from './app/shaders/TestFlatShader';
import { TestLodShader, TestLodShaderID, TestLodShaderState } from './app/shaders/TestLodShader';
import { LambertVShader } from './app/shaders/VariantShaderTest';
import { Camera } from './tsgl/3d/Camera';
import { GLTFData } from './tsgl/3d/gltf/GLFTSchema';
import { GLTFNode } from './tsgl/3d/gltf/GLTFNode';
import {
  setBufferViewTargetFromMesh,
  loadBuffers,
  getBufferViewsDataLinkedToBuffer,
  loadBufferView,
  createMesh,
  loadTextures,
} from './tsgl/3d/gltf/GLTFParser';
import { IRenderableInstance3D } from './tsgl/3d/IRenderableInstance3D';
import { DepthOnlyMaterial } from './tsgl/3d/Material/DepthOnlyMaterial';
import { PhongBlinnMaterial } from './tsgl/3d/Material/PhongBlinnMaterial';
import { ShadowOnlyMaterial } from './tsgl/3d/Material/ShadownOnlyMaterial';
import { SkyboxMaterial } from './tsgl/3d/Material/SkyboxMaterial';
import { MeshNode, SceneInstance3D } from './tsgl/3d/SceneInstance3D';
import { ShadowMap } from './tsgl/3d/ShadowMap';
import { CameraLookAtTransform3D } from './tsgl/geom/CameraTargetTransform3D';
import { CubeMapPatronHelper } from './tsgl/geom/CubeMapPatronHelper';
import { createBoxMesh, cubeSquarePatronUv } from './tsgl/geom/mesh/createBoxMesh';
import { createCylinderMesh } from './tsgl/geom/mesh/createCylinderMesh';
import { createPlaneMesh } from './tsgl/geom/mesh/createPlaneMesh';
import { createQuadMesh } from './tsgl/geom/mesh/createQuadMesh';
import { createSkyBoxMesh } from './tsgl/geom/mesh/createSkyBoxMesh';
import { createSphereMesh } from './tsgl/geom/mesh/createSphereMesh';
import { Transform3D } from './tsgl/geom/Transform3D';
import { GLBuffer } from './tsgl/gl/core/data/GLBuffer';
import { GLMesh } from './tsgl/gl/core/data/GLMesh';
import { GLVao } from './tsgl/gl/core/data/GLVao';
import { GLFramebuffer } from './tsgl/gl/core/framebuffer/GLFramebuffer';
import { GLViewportStack } from './tsgl/gl/core/framebuffer/GLViewportState';
import { GLRenderer, GLRendererType, WebGL2Renderer } from './tsgl/gl/core/GLRenderer';
import { IGLTexture } from './tsgl/gl/core/texture/GLTexture';
import { FirstPersonCameraController } from './tsgl/input/CameraController';
import { BasicColorShader } from './tsgl/shaders/BasicColorShader';
import { BasicTextureShaderState, BasicTextureShader, BasicTextureShaderID } from './tsgl/shaders/BasicTextureShader';
import { DepthOnlyShader } from './tsgl/shaders/DepthOnlyShader';
import { MSDFShader } from './tsgl/shaders/MSDFShader';
import { PhongBlinnVShader } from './tsgl/shaders/PhongBlinnVShader';
import {
  PlaneSpaceToModelSpaceNormalShaderState,
  PlaneSpaceToModelSpaceNormalShader,
} from './tsgl/shaders/PlaceSpaceToModelSpaceNormalShader';
import { ShadowOnlyShader } from './tsgl/shaders/ShadowOnlyShader';
import { SimpleLamberianShader } from './tsgl/shaders/SimpleLamberianShader';
import { SimplePBRShader } from './tsgl/shaders/SimplePBRShader';
import { SimpleTextureShader } from './tsgl/shaders/SimpleTextureShader';
import { SkyboxShader } from './tsgl/shaders/SkyboxShader';

import { floatToRgb9_e5, loadHDR, loadHDRToFloatTexture, rgbeToFloat } from './tsgl/helpers/texture/hdr';
import { HDRToCubemap } from './tsgl/baking/HDRRectToCubemap';
import { createFramebufferWithDepthStorage } from './tsgl/helpers/framebuffer';
import { renderFaces } from './tsgl/helpers/texture/CubemapRenderer';
import { createCubemapMipmapEmptyTexture } from './tsgl/helpers/texture/createCubemapMipmapEmptyTexture';
import {
  DebugSkyboxLodShader,
  DebugSkyboxLodShaderID,
  DebugSkyboxLodShaderState,
} from './app/shaders/DebugSkyboxLodShader';
import { BrdfLutShader, BrdfLutShaderID, BrdfLutShaderState } from './tsgl/shaders/BrdfLutShader';
import { createEmptyTextureWithLinearFilter } from './tsgl/helpers/texture/createEmptyTextureWithLinearFilter';
import { Quad } from './tsgl/2d/sprite/Quad';
import { EquiToCubemapShader } from './tsgl/shaders/EquiToCubemapShader';
import { IrradianceShader } from './tsgl/shaders/IrradianceShader';
import { ReflectanceShader, ReflectanceShaderState, ReflectanceShaderID } from './tsgl/shaders/ReflectanceShader';
import { ReflectanceCubemapRenderer } from './tsgl/baking/ReflectanceCubemapRenderer';
import { IrradianceCubemapRenderer } from './tsgl/baking/IrradianceCubemapRenderer';
import { bakeHdrIbl } from './tsgl/baking/bakeHdrIbl';
import { PbrShaderDebug, PbrVShader } from './tsgl/shaders/PbrVShader';
import { PbrMaterial } from './tsgl/3d/Material/PbrMaterial';
import { loadTexture2D } from './tsgl/helpers/texture/loadTexture2D';
import { GLTFMaterialFactory } from './tsgl/3d/gltf/GLTFMaterialFactory';
import { VertexColorShader, VertexColorShaderState } from './tsgl/shaders/VertexColorShader';
import {
  IWireframeBatchPullable,
  VertexColorData,
  WireframeBatch,
  WireframeBatchRenderable,
} from './tsgl/3d/helpers/WireframeBatch';
// import { PbrMaterial } from './tsgl/3d/Material/PbrMaterial';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class QuadBox implements WireframeBatchRenderable, IWireframeBatchPullable {
  position = vec3.create();
  color = vec4.create();

  pull(
    batch: WireframeBatch,
    vertices: VertexColorData[],
    indices: Uint16Array,
    vertexIndex: number,
    indicesIndex: number,
  ): void {
    const position = this.position;

    vec3.set(vertices[vertexIndex].pos, position[0], position[1], position[2]);
    vec3.set(vertices[vertexIndex + 1].pos, position[0] + 1, position[1], position[2]);
    vec3.set(vertices[vertexIndex + 2].pos, position[0], position[1] + 1, position[2]);
    vec3.set(vertices[vertexIndex + 3].pos, position[0] + 1, position[1] + 1, position[2]);

    vec4.copy(vertices[vertexIndex].color, this.color);
    vec4.copy(vertices[vertexIndex + 1].color, this.color);
    vec4.copy(vertices[vertexIndex + 2].color, this.color);
    vec4.copy(vertices[vertexIndex + 3].color, this.color);

    indices[indicesIndex] = vertexIndex;
    indices[indicesIndex + 1] = vertexIndex + 1;
    indices[indicesIndex + 2] = vertexIndex + 1;
    indices[indicesIndex + 3] = vertexIndex + 3;
    indices[indicesIndex + 4] = vertexIndex + 3;
    indices[indicesIndex + 5] = vertexIndex + 2;
    indices[indicesIndex + 6] = vertexIndex + 2;
    indices[indicesIndex + 7] = vertexIndex;
  }
  draw(batch: WireframeBatch): void {
    batch.push(8, 4, this);
  }
}

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  private _corsetNode: GLTFNode;
  private _modelSpaceFramebuffer: GLFramebuffer;

  private _camController: FirstPersonCameraController;
  private _cubeMap: IGLTexture;
  fb: GLFramebuffer;
  vps: GLViewportStack;
  private _flatMat: TestFlatMaterial;
  // private _irradianceHelper: IrradianceHelper;
  private _skybox: MeshNode;
  private _ppTomsNormal: PlaneSpaceToModelSpaceNormalShaderState;
  private _sphere: MeshNode;
  private _sceneRenderables: SceneInstance3D;
  private _lcam: Camera<CameraLookAtTransform3D>;
  private _quad: GLMesh;
  private _quadSS: BasicTextureShaderState;
  private _shadowMap: ShadowMap;
  private _shadowMat: ShadowOnlyMaterial;
  wireframes: WireframeBatch;
  wireframesSS: VertexColorShaderState;
  wfs: QuadBox[];
  constructor() {
    super(GLRendererType.WebGL2);
    this.cubeTransform = new Transform3D();
  }

  getCanvas(): HTMLCanvasElement {
    return document.getElementById('test') as HTMLCanvasElement;
  }

  protected async prepare(renderer: WebGL2Renderer, gl: WebGL2RenderingContext): Promise<void> {
    // register shaders
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
    SimplePBRShader.register(renderer);
    BasicColorShader.register(renderer);
    TestLodShader.register(renderer);
    TestBlurShader.register(renderer, 4);
    CopyShader.register(renderer);
    EquiToCubemapShader.register(renderer);
    IrradianceShader.register(renderer);
    ReflectanceShader.register(renderer);
    DebugSkyboxLodShader.register(renderer);
    BrdfLutShader.register(renderer);
    VertexColorShader.register(renderer);

    const brdfLut = await loadTexture2D(gl, './images/lut_test_2.png');

    this.wireframes = new WireframeBatch(this.renderer.gl);
    this.wireframesSS = this.renderer.getShader<VertexColorShaderState>('vertex_color').createState();

    // .then((response) => response.blob())
    // .then((blob) => createImageBitmap(blob))
    // .then((image) => createImageTextureWithLinearFilter(gl as WebGL2RenderingContext, image))
    // .then((itexture) => new GLTexture({ gl, texture: itexture.texture }, gl.TEXTURE_2D));

    this.wfs = [new QuadBox(), new QuadBox(), new QuadBox()];

    vec3.set(this.wfs[1].position, 2, 2, 0);
    vec3.set(this.wfs[2].position, 0, 2, 2);

    vec4.set(this.wfs[0].color, 1, 0, 0, 1);
    vec4.set(this.wfs[1].color, 0, 1, 0, 1);
    vec4.set(this.wfs[2].color, 0, 0, 1, 1);

    PbrVShader.register(renderer, brdfLut);

    // load scene;

    await this.loadScene();

    this._lcam = new Camera(CameraLookAtTransform3D).setPerspective(
      70,
      this.renderer.width / this.renderer.height,
      0.1,
      100,
    );
    this._lcam.transform.setPosition(0, 0, 2);
    // this._lcam.transform.setTargetPosition(0,0,0);
    this._camController = new FirstPersonCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);
  }

  ready() {
    this.start();
  }

  protected async loadScene(): Promise<void> {
    const light = {
      direction: vec3.normalize(vec3.create(), vec3.fromValues(-1, -1, 0)),
      color: vec3.fromValues(1.0, 1.0, 1.0),
      specularColor: vec3.fromValues(0.3, 0.3, 0.3),
      shininess: 32.0,
      ambiantColor: vec3.fromValues(0.7, 0.7, 0.7),
    };

    const hdrIbl = await bakeHdrIbl(this.renderer as WebGL2Renderer, {
      source: './images/ballroom_2k.hdr',
      baseCubemap: {
        size: 512,
      },
      reflectance: {
        size: 128,
        // levels: 8
      },

      irradiance: {
        size: 128,
      },
    });

    this._cam.transform.setPosition(0, 0, 3);

    const gl = this.renderer.gl;

    const dir = './models/bottle';

    const gltfData: GLTFData = await fetch(`${dir}/SpecGlossVsMetalRough.gltf`).then((response) => response.json());
    setBufferViewTargetFromMesh(gl, gltfData);

    const glBuffers: GLBuffer[] = new Array(gltfData.bufferViews.length);

    await loadBuffers(gltfData, dir, (ind, buffer) => {
      getBufferViewsDataLinkedToBuffer(gltfData, ind).forEach((bufferViewData) => {
        glBuffers[bufferViewData.ind] = loadBufferView(gl, bufferViewData.bufferView, buffer);
      });
    });

    const textures = await loadTextures(gl, gltfData, dir);

    const matFactory = new GLTFMaterialFactory(this.renderer, [PbrMaterial], gltfData.materials, textures, {
      lightDirection: light.direction,
      irradianceMap: hdrIbl.irradiance.cubemap,
      reflectanceMap: hdrIbl.reflectance.cubemap,
    });

    const corsetMesh = createMesh(
      this.renderer,
      gltfData.meshes[0],
      gltfData.accessors,
      gltfData.bufferViews,
      glBuffers,
      matFactory,
    );
    const corsetNormalMap = textures[2];
    const corsetPbrMap = textures[1];
    const corsetdiffuseMap = textures[0];

    this._shadowMap = new ShadowMap(this.renderer, 1024, 1024, 10, 0.001, 30);
    this._shadowMap.setPosition(2, 2, 2);
    this._shadowMap.setLookAt(-1, -1, -1);

    this._shadowMat = new ShadowOnlyMaterial(this.renderer, this._shadowMap);

    const pbrMat = PbrMaterial.buildFromGLTF(
      this.renderer,
      gltfData.materials[gltfData.meshes[0].primitives[0].material],
      gltfData.meshes[0].primitives[0],
      textures,
      {
        lightDirection: light.direction,
        irradianceMap: hdrIbl.irradiance.cubemap,
        reflectanceMap: hdrIbl.reflectance.cubemap,
      },
    );

    pbrMat.shadowMap = this._shadowMap;

    pbrMat.setGammaExposure(1.3, 1.0);

    this._corsetNode = new GLTFNode(corsetMesh, gltfData.nodes[0]);
    this._corsetNode.transform.setScale(20);
    this._corsetNode.transform.setPosition(0, -0.5, 0);

    this._skybox = new MeshNode(
      new SkyboxMaterial(this.renderer, hdrIbl.baseCubemap.cubemap),
      createSkyBoxMesh(this.renderer.gl),
    );

    this._skybox.transform.setScale(50);

    // phongBlinnMaterial.irradianceMap = this._irradianceHelper.framebufferTexture;

    this._quad = createQuadMesh(gl);
    this._quadSS = this.renderer.getShader(BasicTextureShaderID).createState() as BasicTextureShaderState;

    const cubeMesh = createBoxMesh(gl, 1, 1, 1, 3, 3, 3, cubeSquarePatronUv);
    const sphereMat = new PbrMaterial(
      this.renderer,
      light.direction,
      hdrIbl.irradiance.cubemap,
      hdrIbl.reflectance.cubemap,
    );

    sphereMat.roughness = 1;
    sphereMat.metallic = 0.3;

    sphereMat.shadowMap = this._shadowMap;
    // sphereMat.diffuseMap = hdrIbl.lut.lookupTexture;
    // sphereMat.irradianceMap = this._irradianceHelper.framebufferTexture;
    // this._sphere = new MeshNode(sphereMat, cubeMesh);
    // this._sphere.transform.translate(0.5, 1, 1);

    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setScale(10);
    plane.transform.setPosition(0, -3, 0);

    this._sceneRenderables = new SceneInstance3D();

    // this._shadowCam.transform.setPosition(-10,-10,-10);
    // quat.rotationTo(this._shadowCam.transform.getRawRotation(), this._sphere.transform.getRawPosition(), this._shadowCam.transform.getRawPosition());

    [plane, this._corsetNode, this._skybox].forEach((node) => this._sceneRenderables.addChild(node));
    // [this._skybox, this._sphere, this._corsetNode, plane].forEach((node) => this._sceneRenderables.addChild(node));
    // [plane, this._skybox].forEach((node) => this._sceneRenderables.addChild(node));

    const step = 10;
    const mesh = createSphereMesh(this.renderer.gl, 0.5, 32, 32);
    // for (let i = 0; i <= step; i++) {
    //   for (let f = 0; f <= step; f++) {
    //     // const pbrMat = new PhongBlinnMaterial(this.renderer, light);

    //     const pbrMat = new SimplePBRMaterial(this.renderer, light,  hdrIbl.irradiance.cubemap, hdrIbl.reflectance.cubemap);

    //     pbrMat.brdfLUT = testLut;

    //     vec3.set(pbrMat.color,0,0,0);

    //     pbrMat.metallic = f / step;
    //     pbrMat.roughness = i / step * 0.99;

    //     const pbrSphere = new MeshNode(pbrMat, mesh);
    //     // const pbrSphere = new MeshNode(pbrMat, createBoxMesh(gl,0.5,0.5,0.5));

    //     pbrSphere.transform.translate(i + 1.0, f * 3.0, 0);

    //     this._sceneRenderables.addChild(pbrSphere);
    //   }
    // }
    // return;
    for (let i = 0; i <= step; i++) {
      for (let f = 0; f <= step; f++) {
        // const pbrMat = new PhongBlinnMaterial(this.renderer, light);

        const pbrMat = new PbrMaterial(
          this.renderer,
          light.direction,
          hdrIbl.irradiance.cubemap,
          hdrIbl.reflectance.cubemap,
        );

        // pbrMat.setGammaExposure(2.2,1.0);
        // pbrMat.enableHDRCorrection();
        pbrMat.setGammaExposure(1.3, 1.0);

        pbrMat.setDiffuseColor(1, 1, 1);

        pbrMat.metallic = f / step;
        pbrMat.roughness = (i / step) * 0.99;

        const pbrSphere = new MeshNode(pbrMat, mesh);
        // const pbrSphere = new MeshNode(pbrMat, createBoxMesh(gl,0.5,0.5,0.5));

        pbrSphere.transform.translate(i + 3.0, f, 0);

        this._sceneRenderables.addChild(pbrSphere);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);
    //
    this._corsetNode.transform.rotateEuler(0, elapsedTime * 0.0002, 0);

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


    // const renderer = this.renderer;
    // const gl = this.renderer.gl;

    // this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());

    // this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));

    this.wireframes.begin(this.wireframesSS, this._cam);
    this.wfs.forEach((quad) => quad.draw(this.wireframes));
    this.wireframes.end();

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
