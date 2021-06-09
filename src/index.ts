/* eslint-disable @typescript-eslint/no-unused-vars */

import { Camera } from './tsgl/3d/Camera';

import { VertexColorShader, VertexColorShaderState } from './tsgl/shaders/VertexColorShader';
import { WireframeBatch } from './tsgl/3d/helpers/WireframeBatch';
import { Base2DApp } from './app/Base2DApp';
import SubTextureAtlas from './tsgl/2d/SubTextureAtlas';
// import { PbrMaterial } from './tsgl/3d/Material/PbrMaterial';

import { SpriteElement } from './tsgl/2d/sprite/SpriteElement';
import { b2World } from './physics/box2d/dynamics/b2_world';
import { b2Body } from './physics/box2d/dynamics/b2_body';
import { GLSupport } from './tsgl/gl/core/GLSupport';
import { DrawDebugger } from './physics/DrawDebugger';
import { b2Transform } from './physics/box2d/common/b2_math';
import { b2DrawFlags } from './physics/box2d/common/b2_draw';
import RUBELoader from './physics/RubeLoader';
import { TranslateRotateTransform3D } from './tsgl/geom/TranslateRotateTransform3D';
import { OrthoCameraController } from './tsgl/input/CameraController';
import { GamepadController, KeyboardController } from './tsgl/input/GameInput';
import { GameInputEventStage, GameInputKey, InputId } from './tsgl/input/types';
import BoatControl from './app/helpers/BoatControl';
import { Sprite } from './tsgl/2d/sprite/Sprite';
import { Group } from './tsgl/2d/Group';
import { SpriteGroup } from './tsgl/2d/sprite/SpriteGroup';
// import boatControl from './app/helpers/BoatControl';
// import { GameInput, GameInputController, GameInputEventType } from './tsgl/input/_GameInput';

window.addEventListener('load', async () => {
  const app = new TestApp();
});

class TestApp extends Base2DApp {
  // sprite1: Sprite;
  physicsWorld: b2World;
  box: b2Body;
  // boxB: b2Body;
  ground: b2Body;
  // sprite2: Sprite;
  // groundSprite: Sprite;
  wireframeBatch: WireframeBatch;
  vcShader: VertexColorShaderState;
  ddraw: DrawDebugger;
  testTr: b2Transform;
  testTrPv: b2Transform;
  // physicsCam: Camera<TranslateRotateTransform3D>;
  camController: OrthoCameraController;
  boat: b2Body;
  gi: KeyboardController;
  gpi: GamepadController;
  sprite1: Sprite;
  mainContainer: SpriteGroup;
  // physicsWorld: World;
  constructor() {
    super(document.getElementById('test') as HTMLCanvasElement);
    this.init();
  }

  protected syncSpriteToBody(body: b2Body, element: SpriteElement) {
    const position = body.GetPosition();
    // const y = this.renderer.height - body.position.y;

    element.setPosition(position.x * 8, position.y * -8);
    element.rotation = -body.GetAngle();
  }

  protected async init() {
    const atlas = await SubTextureAtlas.load(this.renderer.gl, './spritesheet/test-json');


    this.sprite1 = new Sprite(atlas.subTextures.battery);
    
    this.mainContainer = new SpriteGroup();

    //this.mainContainer.setScale(1/16,-1/16);

    this.mainContainer.addChild(this.sprite1);
    this.stage.addChild(this.mainContainer);
    
    this.physicsWorld = new b2World({ x: 0, y: -10 });

    this.wireframeBatch = new WireframeBatch(GLSupport.VAOSupport(this.renderer.gl));

    VertexColorShader.register(this.renderer);
    this.vcShader = this.renderer.getShader<VertexColorShaderState>('vertex_color').createState();

    const rad = 30;
    const up = (rad * this.renderer.height) / this.renderer.width;
    this.cam.setOrtho(-rad, rad, -up, up);
    this.cam.transform.setPosition(0, 0, 10);

    this.ddraw = new DrawDebugger(this.wireframeBatch, 1 / (rad / 2));
    this.ddraw.SetFlags(b2DrawFlags.e_jointBit | b2DrawFlags.e_shapeBit);

    

    this.physicsWorld.SetDebugDraw(this.ddraw);
    // this.physicsWorld.

    const loader = new RUBELoader();

    const data = await fetch('physics-data/test-rube-images.json').then((res) => res.json());
    const worldData = loader.parseWorld(data, this.physicsWorld);
    console.log('worldData',loader.images);
    this.gi = new KeyboardController();

    this.gpi = new GamepadController(InputId.Player2);

    this.gpi.addKeyListenner(GameInputKey.D_PAD_LEFT, GameInputEventStage.PRESS, (e) => console.log('e', e));
    // gi.addKeyListenner(GameInputKey.D_PAD_RIGHT, null, (e) => console.log('e', e));

    // console.log('inputState',inputState.stick_axis_left);
    // setInterval(() => console.log('inputState',inputState),100);
    console.log('BoatControl',BoatControl);

    BoatControl.alignRatio = 0.1;
    BoatControl.forwardForce = 10; 
    BoatControl.backwardForce = 10; 
    BoatControl.directionTorque = 3; 

    this.boat = loader.getBodyFromName('mainBoat');

    const xy = this.boat.GetPosition();

    this.sprite1.setPosition(xy.x,xy.y);


    
    

    this.start();
  }

  update(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');
    // this.physicsWorld.Step(elapsedTime / 1000, 8,3,3);

    // boatControl.update(this.boat);
    this.gpi.update();
    // Engine.update(this.physicsEngine, elapsedTime / 2.0);
    // console.log('this.boxA.position',this.boxA.position);
    // this.syncSpriteToBody(this.box, this.sprite1);
    // this.syncSpriteToBody(this.boxB, this.sprite2);
    // this.syncSpriteToBody(this.ground, this.groundSprite);
    // this.testTrPv.SetRotationAngle(time / 1000 * Math.PI);
    // console.log(' this.gpi.', this.gpi.axes.stick_axis_left);
    // this.camController.update(elapsedTime);

    BoatControl.update(this.boat);
    this.physicsWorld.Step(elapsedTime / 500, 3, 1);


    const boatPos = this.boat.GetPosition();
    this.cam.transform.setPosition(boatPos.x,boatPos.y,1);

    this.sprite1.setPosition(boatPos.x,boatPos.y);

  }
  beforeRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');
  }
  afterRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');
    const gl = this.renderer.gl;
    // gl.disable(gl.CULL_FACE);

    this.cam.updateTransform();

    this.wireframeBatch.begin(this.vcShader, this.cam);
    // this.ddraw.PushTransform(this.testTr);
    // this.ddraw.PushTransform(this.testTrPv);
    // // this.ddraw.DrawSegment({ x: 50, y: 50 }, { x: 100, y: 70 }, { r: 1, g: 0, b: 1, a: 1 });
    // this.ddraw.DrawCircle({ x: 100, y: 100 }, 10, { r: 1, g: 1, b: 1, a: 1 });
    // this.ddraw.DrawPolygon(
    //   [
    //     { x: -10, y: -10 },
    //     { x: 10, y: -10 },
    //     { x: 10, y: 10 },
    //     { x: -10, y: 10 },
    //   ],
    //   4,
    //   { r: 1, g: 1, b: 1, a: 1 },
    // );

    // this.ddraw.DrawParticles(
    //   [
    //     { x: 20, y: 20 },
    //     { x: 100, y: 20 },
    //   ],
    //   15,
    //   [
    //     { r: 0, g: 0, b: 1, a: 1 },
    //     { r: 1, g: 0, b: 0, a: 1 },
    //   ],
    //   2,
    // );
    // this.ddraw.PopTransform(this.testTrPv);
    // this.ddraw.PopTransform(this.testTr);
    this.physicsWorld.DebugDraw();
    this.wireframeBatch.end();
  }
}
