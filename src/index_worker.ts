import { GLTexture } from './gl/core/GLTexture';
import { SimpleGrid, createConvolutionGridIndexMapper, createEmptyDataSet } from './2d/simpleSprite/SimpleGrid';
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
import { ExplosionMap, kernelCompare, explosionTile } from './game/ExplosionMap';
import { CollisionManager, CollisionFlag } from './game/CollisionManager';
import { DebuggerText } from './game/DebuggerText';
import { GameInputState, emptyInputState } from './game/GameInputStateManager';

// var SPECTOR = require('spectorjs');

class PandaGame extends Base2DApp {
  protected static _instance: PandaGame;
  protected explosionGrid: ExplosionMap;
  protected _collisionManager: CollisionManager;
  protected _spawnPoint: { x: number; y: number };
  protected _exitPoint: { x: number; y: number };
  protected _inputState: GameInputState = emptyInputState();

  static init(canvas?: HTMLCanvasElement): PandaGame {
    this._instance = new PandaGame(canvas);
    // this._instance.init(canvas);

    return this._instance;
  }

  static get instance(): PandaGame {
    if (this._instance === undefined) throw new Error('Instance not ready');
    return this._instance;
  }

  activeSpritesGroup: SimpleGroup = new SimpleGroup();

  panda: Panda;
  font: SimpleTextFont;
  text: SimpleText;
  fontTexture: SubTexture;

  textureGrid: SubTexture[];
  backgroundGrid: SimpleGrid;
  activeGrid: SimpleGrid;
  activeGridD: SimpleGridDebugger;
  foregroundGrid: SimpleGrid;
  itemsGrid: SimpleGrid;

  _bombs: Bomb[] = [];

  bombTextures: { base: SubTexture; animation: SubTexture[] };

  get inputState(): GameInputState {
    return this._inputState;
  }

  set inputState(val: GameInputState) {
    if (this._inputState !== val) {
      this._inputState = val;
    }
  }

  async init(canvas?: HTMLCanvasElement) {
    const gl = this._renderer.getGL();
    const texture = await GLTexture.load(gl, '../images/dungeon.png');
    texture.active(0);

    this.textureGrid = createSubTextureGrid(texture, 16, 16);
    this.fontTexture = new SubTexture(texture, 0, 96, 128, 24);
    this.font = new SimpleTextFont(this.fontTexture, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.:-+', 8, 8);

    DebuggerText.init(this.font);

    // this.text = new SimpleText(this.font);
    // this.text.upperCaseOnly = true;

    // this.text.width = 72;

    // this.text.text = 'Le gilles\nde ABCDEFGH';

    const tiledData = (await fetch('../tiles/dungeon.json').then((response) => response.json())) as TiledMap;

    const bgData = tiledData.layers[0] as TiledTileLayer;
    const itemData = tiledData.layers[1] as TiledTileLayer;
    const activeData = tiledData.layers[2] as TiledTileLayer;
    const fgData = tiledData.layers[3] as TiledTileLayer;

    this.backgroundGrid = new SimpleGrid(
      this.textureGrid,
      bgData.data,
      bgData.width,
      bgData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );
    this.backgroundGrid.x = bgData.x;
    this.backgroundGrid.y = bgData.y;

    this.activeGrid = new SimpleGrid(
      this.textureGrid,
      activeData.data,
      activeData.width,
      activeData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );
    this.itemsGrid = new SimpleGrid(
      this.textureGrid,
      itemData.data,
      itemData.width,
      itemData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );

    this.itemsGrid.setPosition(itemData.x, itemData.y);
    this.itemsGrid.addIndexMapper((ind) => (ind <= 128 ? ind : 0));

    const spawnInd = itemData.data.indexOf(241);
    const exitInd = itemData.data.indexOf(242);
    this._spawnPoint = { x: spawnInd % itemData.width, y: Math.floor(spawnInd / itemData.width) };
    this._exitPoint = { x: exitInd % itemData.width, y: Math.floor(exitInd / itemData.width) };

    this.explosionGrid = new ExplosionMap(
      this.textureGrid,
      activeData.width,
      activeData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );
    this.activeGrid.setPosition(activeData.x, activeData.y);

    this.foregroundGrid = new SimpleGrid(
      this.textureGrid,
      fgData.data,
      fgData.width,
      fgData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );
    this.foregroundGrid.x = bgData.x;
    this.foregroundGrid.y = bgData.y;

    const animatedMap = new AnimatedMap();
    animatedMap.addAnimation(2, 65, 2);
    this.juggler.addChild(animatedMap);
    this.foregroundGrid.addIndexMapper(animatedMap.indexMapper);

    this._collisionManager = CollisionManager.defaultInstance;
    this._collisionManager.loadMap(this.backgroundGrid, this.foregroundGrid, this.itemsGrid, this.activeGrid);

    this._collisionManager.onCrateExplode = (x, y) => this.destroyCrate(x, y);
    this._collisionManager.onBombFired = (x, y) => this.fireBomb(x, y);
    this._collisionManager.onItemExplode = (x, y) => this.itemExplode(x, y);

    this.activeGridD = new SimpleGridDebugger(
      this.font,
      this._collisionManager.grid,
      activeData.width,
      activeData.height,
      tiledData.tilewidth,
      tiledData.tileheight,
      this.cam,
    );

    this.activeGridD.setPosition(activeData.x, activeData.y);

    const [textureDown, textureRight, textureUp, textureLeft] = createGridAlignedSubTextures(
      texture,
      16,
      32,
      0,
      8,
      4,
      16,
      16,
    );

    const flowerAnimationTextures = createGridAlignedSubTextures(texture, 16, 16, 0, 4, 2, 16, 16);

    this.juggler.addChild(this.explosionGrid);

    const bombAnimationTexture = createGridAlignedSubTextures(texture, 16, 16, 4, 3, 2);

    this.bombTextures = { base: bombAnimationTexture[0], animation: bombAnimationTexture };

    this.panda = new Panda(
      {
        down: textureDown,
        right: textureRight,
        up: textureUp,
        left: textureLeft,
      },
      this._spawnPoint,
    );

    this.panda.onHitGridActiveElement = (x, y, flags) => this.onPandaHitActiveElement(x, y, flags);

    this.stage.addChild(this.backgroundGrid);
    this.stage.addChild(this.itemsGrid);
    this.stage.addChild(this.activeGrid);
    this.stage.addChild(this.explosionGrid);

    this.stage.addChild(this.activeSpritesGroup);

    this.stage.addChild(this.foregroundGrid);
    // this.stage.addChild(this.activeGridD);
    this.stage.gui.addChild(DebuggerText.defaultInstance);

    this.activeSpritesGroup.addChild(this.panda);

    this.panda.onDropBomb = (x, y) => this.dropBomb(x, y, this.panda.traverseCrate);
    this.panda.onDead = () => console.log('Panda dead');
  }

  itemExplode(x: number, y: number): void {
    this.itemsGrid.setDataAt(x, y, 0);
  }

  onPandaHitActiveElement(x: number, y: number, flags: number) {
    // DebuggerText.defaultInstance.log(`Panda hit ${flags} at ${x} ${y}`);
    if ((flags & CollisionFlag.Item) !== 0) {
      const item = this.itemsGrid.getDataAt(x, y);
      this.panda.handlePowerUp(item);
      // remove item
      this._collisionManager.unsetFlag(x, y, CollisionFlag.Item);
      this.itemsGrid.setDataAt(x, y, 0);

      // switch (item) {
      // }
    }

    if ((flags & CollisionFlag.Explosion) !== 0) {
      this.panda.explosionHit();
    }
    if ((flags & CollisionFlag.Exit) !== 0) {
      debugger;
    }
  }

  explode(bomb: Bomb) {
    const gridX = bomb.x / 16;
    const gridY = bomb.y / 16;
    this._collisionManager.unsetFlag(gridX, gridY, CollisionFlag.Bomb);

    const collision = new Explosion(
      gridX,
      gridY,
      this.panda.bombLength,
      bomb.traverseCrate,
      this.activeGrid,
      this.explosionGrid,
      this.foregroundGrid,
      this.backgroundGrid,
    );
    collision.onComplete = (explosion) => {
      this.juggler.removeChild(explosion);
    };
    this.juggler.addChild(collision);

    this.juggler.removeChild(bomb);
    bomb.removeFromParent();
    this._bombs.splice(this._bombs.indexOf(bomb), 1);
  }

  dropBomb(gridX: number, gridY: number, traverseCrate: boolean): boolean {
    // console.log(gridX, gridY);
    if (!this._collisionManager.isWall(gridX, gridY)) {
      const bomb = new Bomb(this.bombTextures.base, traverseCrate, this.bombTextures.animation, this.panda);
      this._bombs.push(bomb);

      bomb.setPosition(gridX * 16, gridY * 16);
      bomb.onExplode = (bomb) => this.explode(bomb);
      this._collisionManager.setFlag(gridX, gridY, CollisionFlag.Bomb);
      this.juggler.addChild(bomb);
      this.activeSpritesGroup.addChild(bomb);
      return true;
    }
    return false;
  }

  fireBomb(x: number, y: number) {
    for (let i = 0; i < this._bombs.length; i++) {
      const bomb = this._bombs[i];
      if (bomb.x / 16 === x && bomb.y / 16 === y) {
        bomb.explode();
        break;
      }
    }
  }

  destroyCrate(x: number, y: number) {
    this.activeGrid.setDataAt(x, y, 0);
    this.foregroundGrid.setDataAt(x, y - 1, 0);
    // remove floor shadow if there is floor (index <= 8 are all floor tiles)
    if (this.backgroundGrid.getDataAt(x, y + 1) <= 8) {
      this.backgroundGrid.setDataAt(x, y + 1, Math.floor(Math.random() * 2) + 7);
    }
    this._collisionManager.unsetFlag(x, y, CollisionFlag.Crate);
  }

  update(time: number, elapsedTime: number): void {
    DebuggerText.defaultInstance.clear();
    this.panda.update(this._inputState, this.backgroundGrid, this.activeGrid, time, elapsedTime);

    const canvas = this.renderer.canvas;
    this.cam.setClampedPosition(
      Math.floor(this.panda.x) - canvas.width / 2,
      Math.floor(this.panda.y) - canvas.height / 2,
      0,
      432,
      0,
      320,
    );
  }
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
  onmessage = function(evt) {
    switch (evt.data.subject) {
      case 'init':
        ready(evt.data.canvas);
        break;
      case 'input':
        panda.inputState = evt.data.state;
        // console.log('panda.inputState : ', panda.inputState);
        break;
    }
  };
} else {
  // console.log("I'm fairly confident I'm in the renderer thread");

  document.addEventListener('load', () => ready());
}
