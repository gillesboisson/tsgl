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
import { TopDownCameraController } from "./tsgl/input/TopDownCameraController";
import { DepthOnlyShader } from './tsgl/shaders/DepthOnlyShader';
import { PhongBlinnVShader } from './tsgl/shaders/PhongBlinnVShader';

import { PbrVShader } from './tsgl/shaders/PbrVShader';
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

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base3DApp {
  meshVao: GLVao;
  cubeTransform: Transform3D;
  // private _modelNode: GLTFNode;
  private _modelSpaceFramebuffer: GLFramebuffer;

  private _camController: TopDownCameraController;
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
  private _processPass: ProcessPass<CartoonPassShaderState>;

  constructor() {
    super(GLRendererType.WebGL2, { antialias: false });
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

    // load scene;

    this.renderer.resize(this.renderer.width / 3, this.renderer.height / 3);
    this._mrt = new GLMRTFrameBuffer(this.renderer.gl, this.renderer.width, this.renderer.height, 4, true);

    await this.loadScene();
    // this.renderer.resize(320, 240);

    const hWidth = 10;
    const hHeight = (hWidth * this.renderer.canvas.height) / this.renderer.canvas.width;

    this._cam.setOrtho(-hWidth, hWidth, -hHeight, hHeight);

    this._cam.transform.rotateAroundAxes(vec3.fromValues(1, 0, 0), -Math.PI / 4);

    this._camController = new TopDownCameraController(this._cam, this.renderer.canvas, 0.06, 0.002);

    this._processPass = ProcessPass.createFromMRTFrameBuffer(
      this.renderer,
      this._mrt,
      [
        GLDefaultTextureLocation.COLOR,
        GLDefaultTextureLocation.NORMAL,
        GLDefaultTextureLocation.LIGHT_DIFFUSE,
        GLDefaultTextureLocation.LIGHT_SPEC,
      ],
      renderer.getShader('cartoon_pass') as CartoonPassShader,
    );

    this._processPass.shaderState.resize(this.renderer.width, this.renderer.height);

    // this._postProcessingQuad = createQuadMesh(this.renderer.gl);
    // this._postProcessingMat = new CartoonPassMaterial(
    //   this._mrt.textures[0],
    //   this._mrt.textures[1],
    //   this._mrt.textures[2],
    //   this._mrt.textures[3],
    //   this._mrt.depthTexture,
    // );
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

    this._cam.transform.setPosition(0, 5, 5);

    const gl = this.renderer.gl;

    this._shadowMap = new ShadowMap(this.renderer, 1024, 1024, 10, 0.001, 30);
    this._shadowMap.setPosition(6, 6, 6);
    this._shadowMap.setLookAtFromLight(light);

    const sphereMat = new PhongBlinnCartoonMaterial(this.renderer, light);

    sphereMat.shadowMap = this._shadowMap;

    const planeMesh = createPlaneMesh(gl);
    const plane = new MeshNode(sphereMat, planeMesh);

    plane.transform.rotateEuler(-Math.PI / 2, 0, 0);
    plane.transform.setScale(10);
    plane.transform.setPosition(0, -3, 0);

    this._sceneRenderables = new SceneInstance3D();

    // const mesh = createSphereMesh(this.renderer.gl, 2, 32, 32);
    const mesh = createCylinderMesh(this.renderer.gl, 1, 1, 1, 16);

    const sphere = new MeshNode(sphereMat, mesh);
    const sphere2 = new MeshNode(sphereMat, mesh);

    sphere2.transform.setPosition(3, 3, 3);

    this._sceneRenderables.addChild(...[plane, sphere, sphere2]);
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

    this._mrt.bind();
    this.renderer.clear();
    this._sceneRenderables.getNodes<IRenderableInstance3D>().forEach((node) => node.render(gl, this._cam));

    this._mrt.unbind();

    this._processPass.render(gl);

    // TODO: make a post processing pass system

    // this._postProcessingMat.renderVao(
    //   gl,
    //   this._postProcessingCam,
    //   this._postProcessingTransform,
    //   this._postProcessingQuad.vao,
    //   4,
    //   this._postProcessingQuad.glType,
    //   gl.TRIANGLES,
    // );
  }

  renderElement(renderable: IRenderableInstance3D) {}
}
