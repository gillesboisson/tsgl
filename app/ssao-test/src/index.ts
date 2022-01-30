import { RenderPass3D, DeferredPrepass, DepthOnlyShader, PbrVShader, IrradianceShader, SkyboxShader, ReflectanceShader, BrdfLutShader, PhongBlinnVShader, SSAOBlurShader, CartoonPassShader, DebugSkyboxLodShader, SSAOPass, DeferredPrepassMaterial, SSAOBlurPass, PbrDeferredPass, bakeHdrIbl, ShadowPass } from '@tsgl/3d';
import { SSAOShader } from '@tsgl/3d';
import { SSRShader } from '@tsgl/3d';
import { DeferredPrepassVShader } from '@tsgl/3d/build/shaders/deferredPrepass-v/DeferredPrepassVShader';
import { PbrDeferredVShader } from '@tsgl/3d/build/shaders/pbrDeferred-v/PbrDeferredVShader';
import { PhongBlinnCartoonVShader } from '@tsgl/3d/build/shaders/phongBlinnCartoon-v/PhongBlinnCartoonVShader';
import { PhongBlinnDeferredVShader } from '@tsgl/3d/build/shaders/phongBlinnDeferred-v';
import { PlaneSpaceToModelSpaceNormalShader, EquiToCubemapShader, MeshNode } from '@tsgl/common';
import { GLRendererType, WebGL2Renderer, loadTexture2D, createPlaneMesh, createSphereMesh } from '@tsgl/gl';
import { FirstPersonCameraController } from '@tsgl/input';
import { vec3 } from 'gl-matrix';
import { Base3DApp } from '@app/helpers';
import { MSDFShader } from '@tsgl/2d';





window.addEventListener('load', async () => {
  const app = new SSAOTestApp();
});

class SSAOTestApp extends Base3DApp {
  private _camController: FirstPersonCameraController;
  private _ssaoPass: SSAOPass;
  private _ssaoBlurPass: SSAOBlurPass;
  private _pbrPass: PbrDeferredPass;
  private _shadowPass: ShadowPass;

  constructor() {
    super(GLRendererType.WebGL2, { antialias: true });
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


    const light = {
      direction: vec3.normalize(vec3.create(), vec3.fromValues(0, -1, -1)),
      // color: vec3.fromValues(1.0, 1.0, 1.0),
      // specularColor: vec3.fromValues(0.3, 0.3, 0.3),
      // shininess: 32.0,
      // ambiantColor: vec3.fromValues(0.7, 0.7, 0.7),
    };


    this._cam.transform.rotateAroundAxes(vec3.fromValues(1, 0, 0), 0);
    this._cam.transform.setPosition(0, 1, 10);
    this._camController = new FirstPersonCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);

    const deferredMRT = (this.mainRenderPass as DeferredPrepass).deferredFramebuffer;

    this._shadowPass = new ShadowPass(this.renderer, {
      width: 1024,
      height: 1024,
      radius: 10,
      near: 0.001,
      far: 30,
    },this.renderables);

    this._shadowPass.setPosition(0, 6, 6);
    this._shadowPass.setLookAtFromLight(light);

    this._ssaoPass = new SSAOPass(this.renderer,{
      width: this.renderer.width / 2,
      height: this.renderer.height / 2,
      sourceFramebuffer: deferredMRT,
      noiseKernelSize: 16,
      kernelSize: 32,
      bias: 0.1,
      radius: 0.5,
      power: 3,
    });

    this._ssaoBlurPass = new SSAOBlurPass(this.renderer,{
      sourceTexture: this._ssaoPass.ssaoTexture,
    });


    

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
    

    this._pbrPass = new PbrDeferredPass(renderer, deferredMRT,light.direction,hdrIbl.irradiance.cubemap,hdrIbl.reflectance.cubemap)

    this._pbrPass.enableSSAO(this._ssaoBlurPass.ssaoTexture);
    this._pbrPass.shadowPass = this._shadowPass;

    await this.loadScene();


  }

  protected createMainRenderPass(): RenderPass3D {
      return new DeferredPrepass(this.renderer,{
        emissiveEnabled: false,
      },this.renderables);
  }

  ready() {
    this.start();
  }

  protected async loadScene(): Promise<void> {
    
    const gl = this.renderer.gl;

    const planeMesh = createPlaneMesh(gl);

    const sphereMesh = createSphereMesh(gl,1,16,16);


    const defaultMat = new DeferredPrepassMaterial(this.renderer);
    defaultMat.pbrEnabled = true;
    defaultMat.setDiffuseColor(0.3,0.3,0.9,1);
    defaultMat.metallic = 0.05;
    defaultMat.roughness = 0.7;


    const plane = new MeshNode(defaultMat,planeMesh);

    plane.transform.rotateEuler(-Math.PI/2,0,0);
    plane.transform.setScale(100);
    plane.transform.setPosition(0,-1,0);

    

    const sphere = new MeshNode(defaultMat, sphereMesh);

    sphere.transform.setScale(1);
    sphere.transform.setPosition(-5,0,0);

    this.renderables.addChild(plane,sphere);

    const sphere1 = new MeshNode(defaultMat, sphereMesh);

    sphere1.transform.setScale(1.10);
    sphere1.transform.setPosition(-3,0,0);

    this.renderables.addChild(plane,sphere1);

    const sphere2 = new MeshNode(defaultMat, sphereMesh);

    sphere2.transform.setScale(1.25);
    sphere2.transform.setPosition(-1,0,0);

    this.renderables.addChild(plane,sphere2);

    const sphere3 = new MeshNode(defaultMat, sphereMesh);

    sphere3.transform.setScale(2);
    sphere3.transform.setPosition(2,1,1);

    this.renderables.addChild(plane,sphere3);

    

  }

  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, elapsedTime: number): void {
    this._camController.update(elapsedTime);

    this.renderables.updateTransform();
    
    this._cam.updateTransform();
    this._shadowPass.updateTransform();


  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(time: number, elapsedTime: number): void {
    // this.mainRenderPass.draw({cam: this._cam});
    // (this.renderer.defaultRenderPass as RenderPass3D).draw({cam: this._cam});
    // return;
    const renderer = this.renderer;
    const gl = this.renderer.gl as WebGL2RenderingContext;

    this._shadowPass.render({ cam: this._cam });

    this.mainRenderPass.render({cam: this._cam});
    this._ssaoPass.render({cam: this._cam});
    this._ssaoBlurPass.render(undefined);

    this._pbrPass.render({cam: this._cam});

    
    
    // this.mainRenderPass.render({ cam: this._cam });
  }
}
