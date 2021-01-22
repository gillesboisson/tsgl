import { GLTexture } from './gl/core/GLTexture';
import { Base2DApp } from './game/Base2DApp';
import { ExplosionMap } from './game/ExplosionMap';
import { CollisionManager } from './game/CollisionManager';
import { GameInputState, emptyInputState } from './game/GameInputStateManager';
import { Sprite } from './2d/sprite/Sprite';
import { SpriteGroup } from './2d/sprite/SpriteGroup';
import SubTextureAtlas from './2d/SubTextureAtlas';
import BitmapFont from './2d/text/BitmapFont';
import BitmapText from './2d/text/BitmapText';
import { MSDFShader } from './shaders/MSDFShader';
import { SpriteBatch } from './2d/SpriteBatch';
// import { SPECTOR } from 'spectorjs';

// var SPECTOR = require('spectorjs');

class TestApp extends Base2DApp {
  protected static _instance: TestApp;
  protected explosionGrid: ExplosionMap;
  protected _collisionManager: CollisionManager;
  protected _spawnPoint: { x: number; y: number };
  protected _exitPoint: { x: number; y: number };
  protected _inputState: GameInputState = emptyInputState();
  sprite: Sprite;
  group: SpriteGroup;
  private _msdfShaderState: import('/home/gilles/Projects/sandbox/TsGL2D/src/shaders/MSDFShader').MSDFShaderState;
  private _textBatch: SpriteBatch;
  private _text: BitmapText;

  static init(canvas?: HTMLCanvasElement): TestApp {
    this._instance = new TestApp(canvas);
    // this._instance.init(canvas);

    return this._instance;
  }

  static get instance(): TestApp {
    if (this._instance === undefined) throw new Error('Instance not ready');
    return this._instance;
  }

  get inputState(): GameInputState {
    return this._inputState;
  }

  set inputState(val: GameInputState) {
    if (this._inputState !== val) {
      this._inputState = val;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(canvas?: HTMLCanvasElement) {}

  update(time: number, elapsedTime: number): void {
    // this.sprite.rotation += ((elapsedTime / 1000) * Math.PI) / 4;
    // this.group.rotation += ((elapsedTime / 1000) * Math.PI) / 4;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');

    this._textBatch.begin(this._msdfShaderState, this._cam);
  }

  afterRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');

    this._text.draw(this._textBatch);
    this._textBatch.end();
  }
}

let panda: TestApp;

async function ready(canvas?: HTMLCanvasElement) {
  panda = TestApp.init(canvas);
  await panda.init();
  TestApp.instance.start();
}

// if we're in a worker use messaging system to get input from main thread
if ((self as any).document === undefined) {
  onmessage = function (evt) {
    switch (evt.data.subject) {
      case 'init':
        ready(evt.data.canvas);
        break;
      case 'input':
        break;
    }
  };
} else {
  // or just init
  ready();
}
