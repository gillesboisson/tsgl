import { WireframeBatch, VertexColorShaderState, PhongBlinnMaterial, SSAOPass, SSAOBlurPass, ShadowPass, SSRPass, RenderPass3D, DeferredPrepass, DepthOnlyShader, PbrVShader, IrradianceShader, SkyboxShader, ReflectanceShader, BrdfLutShader, PhongBlinnVShader, bakeHdrIbl, CartoonPassMaterial, DeferredPrepassMaterial, PbrDeferredPass, SSAOBlurShader, CartoonPassShader, DebugSkyboxLodShader } from '@tsgl/3d';
import { SSAOShader } from '@tsgl/3d';
import { SSRShader } from '@tsgl/3d';
import { DeferredPrepassVShader } from '@tsgl/3d/build/shaders/deferredPrepass-v/DeferredPrepassVShader';
import { PbrDeferredVShader } from '@tsgl/3d/build/shaders/pbrDeferred-v/PbrDeferredVShader';
import { PhongBlinnCartoonVShader } from '@tsgl/3d/build/shaders/phongBlinnCartoon-v/PhongBlinnCartoonVShader';
import { PhongBlinnDeferredVShader } from '@tsgl/3d/build/shaders/phongBlinnDeferred-v';
import { Transform3D, Camera, MeshNode, PlaneSpaceToModelSpaceNormalShader, EquiToCubemapShader, IRenderableInstance3D } from '@tsgl/common';
import { GLVao, GLFramebuffer, GLViewportStack, GLMRTFrameBuffer, GLMesh, GLRendererType, WebGL2Renderer, loadTexture2D, createSphereMesh, createPlaneMesh, createBoxMesh } from '@tsgl/gl';
import { FirstPersonCameraController } from '@tsgl/input';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Base3DApp } from '@app/helpers';
import { SpriteGroup, MSDFShader } from '@tsgl/2d';





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
  // private _sceneRenderables: SceneInstance3D;
  // private _shadowMap: ShadowMap;
  wireframes: WireframeBatch;
  wireframesSS: VertexColorShaderState;
  private _mrt: GLMRTFrameBuffer;
  private _postProcessingQuad: GLMesh;
  private _postProcessingMat: CartoonPassMaterial;
  private _postProcessingCam = Camera.createOrtho(-1, 1, -1, 1, 0.001, 1);
  private _postProcessingTransform = mat4.create();
  private _processPass: PbrDeferredPass;
  // private _deferredMRT: DeferredFrameBuffer;
  offDeferredNode: MeshNode<PhongBlinnMaterial>;
  private _ssaoPass: SSAOPass;
  private _ssaoBlurPass: SSAOBlurPass;
  private _shadowPass: ShadowPass;
  private _ssrPass: SSRPass;
  private _pbrFB: GLFramebuffer;

  constructor() {
    super(GLRendererType.WebGL2, { antialias: true });
    this.cubeTransform = new Transform3D();

    const _st2DTest = new SpriteGroup();
  }

  getCanvas(): HTMLCanvasElement {
    return document.getElementById('test') as HTMLCanvasElement;
  }

  protected createMainRenderPass(): RenderPass3D {
    return new DeferredPrepass(
      this.renderer,
      {
        emissiveEnabled: false,
      },
      this.renderables,
    );
  }

  protected async prepare(renderer: WebGL2Renderer, gl: WebGL2RenderingContext): Promise<void> {
    PhongBlinnCartoonVShader.register(renderer);
    DepthOnlyShader.register(renderer);
    CartoonPassShader.register(renderer);

    const brdfLut = await loadTexture2D(gl, './images/lut_test_2.png');

    PbrVShader.register(renderer, brdfLut);
    PbrDeferredVShader.register(renderer, brdfLut);
    DeferredPrepassVShader.register(renderer);
    DeferredPrepassVShader.register(renderer);
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

    // this._deferredMRT = new DeferredFrameBuffer(this.renderer.gl as WebGL2RenderingContext, {
    //   width: this.renderer.width,
    //   height: this.renderer.height,
    //   useDepthTexture: true,
    //   pbrEnabled: true,
    //   emissiveEnabled: true,
    // });

    await this.loadScene();
    // this.renderer.resize(320, 240);

    const hWidth = 10;
    const hHeight = (hWidth * this.renderer.canvas.height) / this.renderer.canvas.width;

    // this._cam.setOrtho(-hWidth, hWidth, -hHeight, hHeight);

    this._cam.transform.rotateAroundAxes(vec3.fromValues(1, 0, 0), 0);
    this._cam.transform.setPosition(0, 0, 15);
    // this._camController = new TopDownCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);
    this._camController = new FirstPersonCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);
  }

  ready() {
    this.start();
  }

  protected async loadScene(): Promise<void> {
    const light = {
      direction: vec3.normalize(vec3.create(), vec3.fromValues(-1, -1, -1)),
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

    // const cube = new MeshNode(new PhongBlinnMaterial(this.renderer, light), createBoxMesh(this.renderer.gl));

    const planeMat = new DeferredPrepassMaterial(this.renderer);
    planeMat.pbrEnabled = true;
    planeMat.roughness = 0.7;
    planeMat.metallic = 0.1;
    planeMat.setDiffuseColor(0, 0, 1, 1);

    const colors = [
      vec4.fromValues(1, 0, 0, 1),
      vec4.fromValues(1, 1, 0, 1),
      vec4.fromValues(1, 1, 1, 1),
      vec4.fromValues(1, 0, 1, 1),
      vec4.fromValues(0, 1, 1, 1),
      vec4.fromValues(0, 1, 0, 1),
      vec4.fromValues(0, 0, 0, 1),
    ];

    const gridS = 6;
    // const nodeMesh = createBoxMesh(this.renderer.gl);
    const nodeMesh = createSphereMesh(this.renderer.gl,0.5,16,16);

    // create sphere grid
    // for (let z = 0; z < gridS; z++) {
    //   for (let x = 0; x < gridS; x++) {
    //     for (let y = 0; y < gridS; y++) {
    //       const cubeMat = new DeferredPrepassMaterial(this.renderer);
    //       cubeMat.pbrEnabled = true;
    //       cubeMat.roughness = x / gridS;
    //       cubeMat.metallic = y / gridS;
    //       cubeMat.copyDiffuseColor(colors[(x + y + z) % colors.length]);

    //       const cube = new MeshNode(cubeMat, nodeMesh);
    //       cube.transform.setPosition(x * 1.1, y * 1.1, z * 1.1);

    //       this.renderables.addChild(cube);
    //     }
    //   }
    // }


    // create central sphere

    

    const plane = new MeshNode(planeMat, createPlaneMesh(this.renderer.gl));
    plane.transform.setScale(50);
    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setPosition(0, -0.7, 0);

    this.renderables.addChild(plane);

    const deferredMRT = (this.mainRenderPass as DeferredPrepass).deferredFramebuffer;

    // this._pbrFB = new GLFramebuffer(gl, this.renderer.width, this.renderer.height, false);

    this._shadowPass = new ShadowPass(
      this.renderer,
      {
        width: 1024,
        height: 1024,
        radius: 10,
        near: 0.001,
        far: 30,
      },
      this.renderables,
    );
    this._shadowPass.setPosition(6, 6, 6);
    this._shadowPass.setLookAtFromLight(light);

    this._ssaoPass = new SSAOPass(this.renderer, { sourceFramebuffer: deferredMRT });

    this._ssaoBlurPass = new SSAOBlurPass(this.renderer, { sourceTexture: this._ssaoPass.ssaoTexture });

    this._processPass = new PbrDeferredPass(
      this.renderer as WebGL2Renderer,
      deferredMRT,
      light.direction,
      hdrIbl.irradiance.cubemap,
      hdrIbl.reflectance.cubemap,
    );
    // this._processPass.enableSSAO(this._ssaoBlurPass.ssaoTexture);
    this._processPass.shadowPass = this._shadowPass;
    // this._processPass.debug = PbrShaderDebug.ambiant;
    this._processPass.enableHDRCorrection();
    this._processPass.setGammaExposure(1.3, 1.0);

    this._ssrPass = new SSRPass(this.renderer, {
      sourceFramebuffer: deferredMRT,
      colorTexture: deferredMRT.albedo,
    });
    return;
    const mesh = createSphereMesh(this.renderer.gl, 0.5, 32, 32);
    // const mesh = createCylinderMesh(this.renderer.gl, 1, 1, 10, 16);

    // const sphere = new MeshNode(sphereMat, mesh);
    // const sphere2 = new MeshNode(sphereMat, mesh);

    // sphere2.transform.setPosition(3, 3, 3);

    // this.renderables.addChild(...[plane, sphere, sphere2]);
    // this._sceneRenderables.addChild(sphere);
    const step = 10;

    this.offDeferredNode = new MeshNode(new PhongBlinnMaterial(this.renderer, light), mesh);
    this.offDeferredNode.transform.setScale(10);
    const cubeMesh = createBoxMesh(gl, 0.5, 2, 0.5);

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

        this.renderables.addChild(pbrSphere);
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

    this.renderables.updateTransform();

    this._cam.updateTransform();

    this._shadowPass.updateTransform();

    //this._sceneRenderables.updateTransform();

    //this.offDeferredNode.updateTransform();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.mainRenderPass.draw({cam: this._cam});
    // (this.renderer.defaultRenderPass as RenderPass3D).draw({cam: this._cam});
    // return;
    const renderer = this.renderer;
    const gl = this.renderer.gl as WebGL2RenderingContext;

    this._shadowPass.render({ cam: this._cam });
    this.mainRenderPass.render({ cam: this._cam });
    // this._ssaoPass.render({ cam: this._cam });
    // this._ssaoBlurPass.render(undefined);
    // this._ssrPass.render({ cam: this._cam });
    this._processPass.render({ cam: this._cam });

    // this._shadowMap.renderDepthMap(this._sceneRenderables.getNodes<IRenderableInstance3D>());

    // this._deferredMRT.bind();
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //this.renderer.clear();
    // this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));

    // this._deferredMRT.unbind();

    // this._ssaoPass.render(gl, { cam: this._cam });
    // this._ssaoBlurPass.render(gl);

    // this._pbrFB.bind();
    // this._processPass.render(gl, { cam: this._cam });
    // this._pbrFB.unbind();

    // this._ssrPass.render(gl, { cam: this._cam });

    // this.offDeferredNode.render(gl, this._cam);
  }

  renderElement(renderable: IRenderableInstance3D) {}
}