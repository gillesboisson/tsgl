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
import { SimpleTextureMaterial } from './tsgl/3d/Material/SimpleTextureMaterial';
// import { PbrMaterial } from './tsgl/3d/Material/PbrMaterial';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  // private _modelNode: GLTFNode;
  private _modelSpaceFramebuffer: GLFramebuffer;

  private _camController: FirstPersonCameraController;
  fb: GLFramebuffer;
  vps: GLViewportStack;
  private _sceneRenderables: SceneInstance3D;
  private _shadowMap: ShadowMap;
  wireframes: WireframeBatch;
  wireframesSS: VertexColorShaderState;
  constructor() {
    super(GLRendererType.WebGL2);
    this.cubeTransform = new Transform3D();
  }

  getCanvas(): HTMLCanvasElement {
    return document.getElementById('test') as HTMLCanvasElement;
  }

  protected async prepare(renderer: WebGL2Renderer, gl: WebGL2RenderingContext): Promise<void> {
    PhongBlinnVShader.register(renderer);
    DepthOnlyShader.register(renderer);

    const brdfLut = await loadTexture2D(gl, './images/lut_test_2.png');

    PbrVShader.register(renderer, brdfLut);

    // load scene;

    await this.loadScene();

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

    this._cam.transform.setPosition(0, 0, 3);

    const gl = this.renderer.gl;

    this._shadowMap = new ShadowMap(this.renderer, 1024, 1024, 10, 0.001, 30);
    this._shadowMap.setPosition(2, 2, 2);
    this._shadowMap.setLookAt(-1, -1, -1);

    const sphereMat = new PhongBlinnMaterial(this.renderer, light);

    sphereMat.shadowMap = this._shadowMap;

    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setScale(10);
    plane.transform.setPosition(0, -3, 0);

    this._sceneRenderables = new SceneInstance3D();

    const mesh = createSphereMesh(this.renderer.gl, 0.5, 32, 32);

    const sphere = new MeshNode(sphereMat, mesh);

    [plane, sphere].forEach((node) => this._sceneRenderables.addChild(node));

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);

    this._cam.updateTransform();

    this._shadowMap.updateTransform();

    this._sceneRenderables.updateTransform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    const renderer = this.renderer;
    const gl = this.renderer.gl;

    this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());
    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));
  }

  renderElement(renderable: IRenderableInstance3D) {}
}
