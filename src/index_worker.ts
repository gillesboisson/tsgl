import { GLTexture } from './gl/core/GLTexture';
import { SimpleGrid } from './2d/simpleSprite/SimpleGrid';
import { SubTexture, createSubTextureGrid, createGridAlignedSubTextures } from './2d/SubTexture';
import { TiledMap } from './2d/tiled/TiledMap';
import { TiledTileLayer } from './2d/tiled/TiledTileLayer';
import { SimpleGroup } from './2d//simpleSprite/SimpleGroup';
import { Panda } from './game/Panda';
import { SimpleTextFont, SimpleText } from './2d//simpleSprite/SimpleText';
import { AnimatedMap } from './animation/AnimatedMap';
import { Base2DApp } from './game/Base2DApp';
import { Bomb } from './game/Bomb';
import { Explosion } from './game/Explosion';
import { SimpleGridDebugger } from './2d//simpleSprite/SimpleGridDebugger';
import { ExplosionMap } from './game/ExplosionMap';
import { CollisionManager, CollisionFlag } from './game/CollisionManager';
import { DebuggerText } from './game/DebuggerText';
import { GameInputState, emptyInputState } from './game/GameInputStateManager';
import { Sprite } from './2d/sprite/Sprite';
import { SpriteGroup } from './2d/sprite/SpriteGroup';
import SubTextureAtlas from './2d/SubTextureAtlas';
import BitmapFont from './2d/text/BitmapFont';
import BitmapText from './2d/text/BitmapText';
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

    const spriteAtlas = await SubTextureAtlas.load(gl, './images/spritessheet');

    // console.log('spriteAtlas', spriteAtlas);

    const font = await BitmapFont.load(gl, './images/arial-latin-extended', spriteAtlas.subTextures.arial);
    const font12 = await BitmapFont.load(gl, './images/arial-latin-extended-12', spriteAtlas.subTextures['arial-12']);

    const text = new BitmapText(font12, `Jean Michel\nJosio`, true);
    text.setColor(1, 0, 0, 1);
    text.setScale(1, 1);
    text.width = 30;
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
    this.stage.mainGroup.addChild(text);
    // group.addChild(text);
  }

  update(time: number, elapsedTime: number): void {
    // this.sprite.rotation += ((elapsedTime / 1000) * Math.PI) / 4;
    // this.group.rotation += ((elapsedTime / 1000) * Math.PI) / 4;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');
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
