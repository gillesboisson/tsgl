/* eslint-disable @typescript-eslint/no-unused-vars */
import { mat4, vec3 } from 'gl-matrix';

import { Base3DApp } from './app/Base3DApp';
import { IRenderableInstance3D } from './tsgl/3d/IRenderableInstance3D';
import { PhongBlinnMaterial } from './tsgl/3d/Material/PhongBlinnMaterial';
import { MeshNode, SceneInstance3D } from './tsgl/3d/SceneInstance3D';
import { ShadowMap } from './tsgl/3d/ShadowMap';
import { createPlaneMesh } from './tsgl/geom/mesh/createPlaneMesh';
import { createSphereMesh } from './tsgl/geom/mesh/createSphereMesh';
import { Transform3D } from './tsgl/geom/Transform3D';
import { GLVao } from './tsgl/gl/core/data/GLVao';
import { GLFramebuffer } from './tsgl/gl/core/framebuffer/GLFramebuffer';
import { GLViewportStack } from './tsgl/gl/core/framebuffer/GLViewportState';
import { GLRendererType, WebGL2Renderer } from './tsgl/gl/core/GLRenderer';
import { TopDownCameraController } from './tsgl/input/TopDownCameraController';
import { DepthOnlyShader } from './tsgl/shaders/DepthOnlyShader';
import { PhongBlinnShaderDebug, PhongBlinnVShader } from './tsgl/shaders/PhongBlinnVShader';

import { PbrShaderDebug, PbrVShader } from './tsgl/shaders/PbrVShader';
import { loadTexture2D } from './tsgl/helpers/texture/loadTexture2D';
import { VertexColorShaderState } from './tsgl/shaders/VertexColorShader';
import { WireframeBatch } from './tsgl/3d/helpers/WireframeBatch';
import { createBoxMesh } from './tsgl/geom/mesh/createBoxMesh';
import { createCylinderMesh } from './tsgl/geom/mesh/createCylinderMesh';
import { PhongBlinnCartoonVShader } from './app/shaders/PhongBlinnCartoonVShader';
import { PhongBlinnCartoonMaterial } from './app/materials/PhongBlinnCartoonMaterial';
import { GLMRTFrameBuffer } from './tsgl/gl/core/framebuffer/GLMRTFrameBuffer';
import { CartoonPassShader, CartoonPassShaderState } from './app/shaders/CartoonPassShader';
import { createQuadMesh } from './tsgl/geom/mesh/createQuadMesh';
import { CartoonPassMaterial } from './app/materials/CartoonPassMaterial';
import { Camera } from './tsgl/3d/Camera';
import { ProcessPass } from './tsgl/helpers/postprocess/PostProcessPass';
import { GLDefaultTextureLocation } from './tsgl/gl/core/data/GLDefaultAttributesLocation';
import { DeferredPrepassVShader } from './app/shaders/DeferredPrepassVShader';
import { DeferredFrameBuffer } from './app/DeferredFrameBuffer';
import { DeferredPrepassMaterial } from './app/materials/DeferredPrepassMaterial';
import { DeferredDebugPassShader, DeferredDebugPassShaderState } from './app/shaders/DeferredDebugPassShader';
import { FirstPersonCameraController } from './tsgl/input/FirstPersonCameraController';
import { PhongBlinnDeferredPass } from './app/materials/PhongBlinnDeferredPass';
import { PhongBlinnDeferredVShader } from './app/shaders/PhongBlinnDeferredVShader';
import { BrdfLutShader } from './tsgl/shaders/BrdfLutShader';
import { DebugSkyboxLodShader } from './app/shaders/DebugSkyboxLodShader';
import { EquiToCubemapShader } from './tsgl/shaders/EquiToCubemapShader';
import { IrradianceShader } from './tsgl/shaders/IrradianceShader';
import { MSDFShader } from './tsgl/shaders/MSDFShader';
import { PlaneSpaceToModelSpaceNormalShader } from './tsgl/shaders/PlaceSpaceToModelSpaceNormalShader';
import { ReflectanceShader } from './tsgl/shaders/ReflectanceShader';
import { SkyboxShader } from './tsgl/shaders/SkyboxShader';
import { PbrDeferredVShader } from './app/shaders/PbrDeferredVShader';
import { bakeHdrIbl } from './tsgl/baking/bakeHdrIbl';
import { PbrDeferredPass } from './app/materials/PbrDeferredPass';
import { AnyWebRenderingGLContext } from './tsgl/gl/core/GLHelpers';
import { SSAOShader } from './app/shaders/SSAOShader';
import { SSAOPass } from './app/SSAOPass';
import { SSAOBlurPass } from './app/SSAOBlurPass';
import { SSAOBlurShader } from './app/shaders/SSAOBlurShader';
import { SSRShader } from './app/shaders/SSRShader';
import { SSRPass } from './app/SSRPass';

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
  private _mrt: GLMRTFrameBuffer;
  private _postProcessingQuad: import('/home/gillesboisson/Projects/sandbox/TsGL2D/src/tsgl/gl/core/data/GLMesh').GLMesh;
  private _postProcessingMat: CartoonPassMaterial;
  private _postProcessingCam = Camera.createOrtho(-1, 1, -1, 1, 0.001, 1);
  private _postProcessingTransform = mat4.create();
  private _processPass: PbrDeferredPass;
  private _deferredMRT: DeferredFrameBuffer;
  offDeferredNode: MeshNode<PhongBlinnMaterial>;
  private _ssaoPass: SSAOPass;
  private _ssaoBlurPass: SSAOBlurPass;
  private _ssrPass: SSRPass;
  private _pbrFB: GLFramebuffer;

  constructor() {
    super(GLRendererType.WebGL2, { antialias: true });
    this.cubeTransform = new Transform3D();
  }

  getCanvas(): HTMLCanvasElement {
    return document.getElementById('test') as HTMLCanvasElement;
  }

  protected async prepare(renderer: WebGL2Renderer, gl: WebGL2RenderingContext): Promise<void> {
    PhongBlinnCartoonVShader.register(renderer);
    DepthOnlyShader.register(renderer);
    CartoonPassShader.register(renderer);

    const brdfLut = await loadTexture2D(gl, './images/lut_test_2.png');

    PbrVShader.register(renderer, brdfLut);
    PbrDeferredVShader.register(renderer, brdfLut);
    DeferredPrepassVShader.register(renderer);
    DeferredDebugPassShader.register(renderer);
    PhongBlinnDeferredVShader.register(renderer);
    MSDFShader.register(renderer);
    IrradianceShader.register(renderer);
    SkyboxShader.register(renderer);
    PlaneSpaceToModelSpaceNormalShader.register(renderer);
    EquiToCubemapShader.register(renderer);
    IrradianceShader.register(renderer);
    ReflectanceShader.register(renderer);
    DebugSkyboxLodShader.register(renderer);
    BrdfLutShader.register(renderer);

    PhongBlinnVShader.register(renderer);
    SSAOShader.register(renderer);
    SSRShader.register(renderer);
    SSAOBlurShader.register(renderer);

    // load scene;

    //this.renderer.resize(this.renderer.width, this.renderer.height);
    // this._mrt = new GLMRTFrameBuffer(this.renderer.gl, this.renderer.width, this.renderer.height, 4, true);

    this._deferredMRT = new DeferredFrameBuffer(this.renderer.gl as WebGL2RenderingContext, {
      width: this.renderer.width,
      height: this.renderer.height,
      useDepthTexture: true,
      pbrEnabled: true,
      emissiveEnabled: true,
    });

    this._pbrFB = new GLFramebuffer(gl, this.renderer.width, this.renderer.height, false);


    this._ssaoPass = new SSAOPass(this.renderer, this._deferredMRT);
    this._ssaoBlurPass = new SSAOBlurPass(this.renderer, this._ssaoPass.ssaoTexture);


    await this.loadScene();
    // this.renderer.resize(320, 240);

    const hWidth = 10;
    const hHeight = (hWidth * this.renderer.canvas.height) / this.renderer.canvas.width;

    // this._cam.setOrtho(-hWidth, hWidth, -hHeight, hHeight);

    this._cam.transform.rotateAroundAxes(vec3.fromValues(1, 0, 0), 0);
    this._cam.transform.setPosition(0, 0, 15);
    // this._camController = new TopDownCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);
    this._camController = new FirstPersonCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);

    gl.viewport(0, 0, this.renderer.width, this.renderer.height);

    const light = {
      direction: vec3.normalize(vec3.create(), vec3.fromValues(-1, -1, -0.5)),
      color: vec3.fromValues(1.0, 1.0, 1.0),
      specularColor: vec3.fromValues(1, 1, 1),
      shininess: 100.0,
      ambiantColor: vec3.fromValues(0.2, 0.2, 0.2),
    };

    this._shadowMap.setLookAtFromLight(light);
    this._ssrPass = new SSRPass(this.renderer, this._deferredMRT,this._pbrFB.colorTexture);

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

    this._cam.transform.setPosition(0, 0, 0);

    const gl = this.renderer.gl;

    this._shadowMap = new ShadowMap(this.renderer, 1024, 1024, 10, 0.001, 30);
    this._shadowMap.setPosition(6, 6, 6);
    this._shadowMap.setLookAtFromLight(light);

    const sphereMat = new DeferredPrepassMaterial(this.renderer);

    sphereMat.pbrEnabled = true;
    sphereMat.roughness = 0.7;
    sphereMat.metallic = 0.1;

    sphereMat.setEmissiveColor(vec3.fromValues(0, 0, 0));

    this._processPass = new PbrDeferredPass(
      this.renderer as WebGL2Renderer,
      this._deferredMRT,
      light.direction,
      hdrIbl.irradiance.cubemap,
      hdrIbl.reflectance.cubemap,
    );

    this._processPass.enableSSAO(this._ssaoBlurPass.ssaoTexture);

    this._processPass.shadowMap = this._shadowMap;
    // this._processPass.debug = PbrShaderDebug.ambiant;

    this._processPass.enableHDRCorrection();
    this._processPass.setGammaExposure(1.3, 1.0);
    // this._processPass.debug = 'emissive';

    // sphereMat.shadowMap = this._shadowMap;

    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setScale(30);
    plane.transform.setPosition(0, -3, 0);

    this._sceneRenderables = new SceneInstance3D();

    const mesh = createSphereMesh(this.renderer.gl, 0.5, 32, 32);
    // const mesh = createCylinderMesh(this.renderer.gl, 1, 1, 10, 16);

    const sphere = new MeshNode(sphereMat, mesh);
    const sphere2 = new MeshNode(sphereMat, mesh);

    sphere2.transform.setPosition(3, 3, 3);

    this._sceneRenderables.addChild(...[plane, sphere, sphere2]);
    // this._sceneRenderables.addChild(sphere);
    let step = 10;

    this.offDeferredNode = new MeshNode(new PhongBlinnMaterial(this.renderer, light), mesh);
    this.offDeferredNode.transform.setScale(10);
    const cubeMesh = createBoxMesh(gl,0.5,2,0.5);

    for (let i = 0; i <= step; i++) {
      for (let f = 0; f <= step; f++) {
        // const pbrMat = new PhongBlinnMaterial(this.renderer, light);

        const pbrMat = new DeferredPrepassMaterial(this.renderer);

        pbrMat.pbrEnabled = true;
        pbrMat.emissiveMode = true;

        // pbrMat.setGammaExposure(2.2,1.0);
        // pbrMat.enableHDRCorrection();
        // pbrMat.setGammaExposure(1.3, 1.0);

        pbrMat.setDiffuseColor(1, 1, 1);

        pbrMat.metallic = f / step;
        pbrMat.roughness = (i / step) * 0.99;
        // pbrMat.roughness = ((pbrMat.roughness + 1.0) * (pbrMat.roughness + 1.0)) / 8;

        const pbrSphere = new MeshNode(pbrMat, cubeMesh);
        
        // const pbrSphere = new MeshNode(pbrMat, createBoxMesh(gl,0.5,0.5,0.5));

        pbrSphere.transform.translate(i - 5, -2, f - 5);

        this._sceneRenderables.addChild(pbrSphere);
      }
    }


    // step = 0;

    // for (let i = 0; i <= step; i++) {
    //   for (let f = 0; f <= step; f++) {
    //     // const pbrMat = new PhongBlinnMaterial(this.renderer, light);

    //     const pbrMat = new DeferredPrepassMaterial(this.renderer);

    //     pbrMat.pbrEnabled = true;
    //     pbrMat.emissiveMode = true;

    //     // pbrMat.setGammaExposure(2.2,1.0);
    //     // pbrMat.enableHDRCorrection();
    //     // pbrMat.setGammaExposure(1.3, 1.0);

    //     pbrMat.setDiffuseColor(1, 1, 1);

    //     pbrMat.metallic = Math.random();
    //     pbrMat.roughness = Math.random();

    //     const pbrSphere = new MeshNode(pbrMat, mesh);
    //     // const pbrSphere = new MeshNode(pbrMat, createBoxMesh(gl,0.5,0.5,0.5));

    //     pbrSphere.transform.translate(
    //       Math.random() * 10 - 5,
    //       plane.transform.getRawPosition()[1],
    //       Math.random() * 10 - 5,
    //     );
    //     pbrSphere.transform.setScale(Math.random() * 2, Math.random() * 10, Math.random() * 2);

    //     this._sceneRenderables.addChild(pbrSphere);
    //   }
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);

    this._cam.updateTransform();

    this._shadowMap.updateTransform();

    this._sceneRenderables.updateTransform();

    this.offDeferredNode.updateTransform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    const renderer = this.renderer;
    const gl = this.renderer.gl as WebGL2RenderingContext;

    this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());

    this._deferredMRT.bind();
    this.renderer.clear();
    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));

    this._deferredMRT.unbind();

    this._ssaoPass.render(gl, { cam: this._cam });
    this._ssaoBlurPass.render(gl);

    this._pbrFB.bind();
    this._processPass.render(gl, { cam: this._cam });
    this._pbrFB.unbind();

    this._ssrPass.render(gl, { cam: this._cam });

    // this.offDeferredNode.render(gl, this._cam);
  }

  renderElement(renderable: IRenderableInstance3D) {}
}
