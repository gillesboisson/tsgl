/* eslint-disable @typescript-eslint/no-unused-vars */
import { vec3 } from 'gl-matrix';

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
import { FirstPersonCameraController } from './tsgl/input/CameraController';
import { DepthOnlyShader } from './tsgl/shaders/DepthOnlyShader';
import { PhongBlinnVShader } from './tsgl/shaders/PhongBlinnVShader';

import { PbrVShader } from './tsgl/shaders/PbrVShader';
import { loadTexture2D } from './tsgl/helpers/texture/loadTexture2D';
import { VertexColorShaderState } from './tsgl/shaders/VertexColorShader';
import {
  WireframeBatch,
} from './tsgl/3d/helpers/WireframeBatch';

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
