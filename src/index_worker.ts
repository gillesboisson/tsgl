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

class PandaGame extends Base2DApp {
  protected static _instance: PandaGame;
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

  static init(canvas?: HTMLCanvasElement): PandaGame {
    this._instance = new PandaGame(canvas);
    // this._instance.init(canvas);

    return this._instance;
  }

  static get instance(): PandaGame {
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
  async init(canvas?: HTMLCanvasElement) {
    const gl = this._renderer.getGL();
    const texture = await GLTexture.load(gl, '../images/dungeon.png');
    texture.active(0);

    MSDFShader.register(this._renderer);

    this._msdfShaderState = (this._renderer.getShader('msdf') as MSDFShader).createState();
    this._textBatch = new SpriteBatch(gl as WebGL2RenderingContext);

    const spriteAtlas = await SubTextureAtlas.load(gl, './images/spritessheet');

    // console.log('spriteAtlas', spriteAtlas);

    const font = await BitmapFont.loadFnt(gl, './images/arial-latin-extended', spriteAtlas.subTextures.arial);
    const font12 = await BitmapFont.loadFnt(
      gl,
      './images/arial-latin-extended-12',
      spriteAtlas.subTextures['arial-12'],
    );

    const msdfFont = await BitmapFont.loadJson(gl, './images/ChampagneLimousines-msdf');
    console.log('msdfFont', msdfFont);

    const text = (this._text = new BitmapText(msdfFont, `AJean michel`, true));

    text.fontSize = 230;
    text.lineHeight = 230 + 5;

    // text.setColor(1, 0, 0, 1);
    // text.setScale(1, 1);
    // text.width = 30;
    // text.fontSize = 12;

    console.log('font', text.fontSize);

    const sprite = (this.sprite = new Sprite(spriteAtlas.subTextures.ninja));

    console.log('sprite', sprite);

    const group = (this.group = new SpriteGroup());

    // group.setPosition(0, 0);
    // group.setScale(2, 2);

    // // sprite.setAnchor(0.5, 0.5);
    // sprite.setPosition(8, 0);
    // // sprite.rotation = Math.PI / 4;
    // sprite.setScale(0.5, 0.5);
    // this.stage.mainGroup.addChild(text);
    // group.addChild(text);
  }

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

let panda: PandaGame;

async function ready(canvas?: HTMLCanvasElement) {
  panda = PandaGame.init(canvas);
  await panda.init();
  PandaGame.instance.start();
}

if ((self as any).document === undefined) {
  // postMessage("I'm fairly confident I'm a webworker");
  onmessage = function (evt) {
    switch (evt.data.subject) {
      case 'init':
        ready(evt.data.canvas);
        break;
      case 'input':
        // panda.inputState = evt.data.state;
        // console.log('panda.inputState : ', panda.inputState);
        break;
    }
  };
} else {
  // console.log("I'm fairly confident I'm in the renderer thread");
  ready();
  // document.addEventListener('load', () => ready());
}
