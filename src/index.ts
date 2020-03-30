import { GLRenderer, GLRendererType } from './gl/core/GLRenderer';
import { GLTexture } from './gl/core/GLTexture';
import { Camera } from './3d/Camera';
import { SpriteBatchPullable, SpriteBatchData, SpriteBatch } from './2d/SpriteBatch';
import { SpriteShader, SpriteShaderState } from './shaders/SpriteShader';
import { SimpleSprite } from './2d/SimpleSprite';
import { SimpleGrid } from './2d/SimpleGrid';
import { SubTexture, createSubTextureGrid, createGridAlignedSubTextures } from './2d/SubTexture';
import { Camera2D } from './2d/Camera2D';
import { TiledMap } from './2d/tiled/TiledMap';
import { TiledTile } from './2d/tiled/TiledTile';
import { TiledTileLayer } from './2d/tiled/TiledTileLayer';
import { SimpleGroup } from './2d/SimpleGroup';
import { GameInput, GameInputKey } from './game/GameInput';
import GameInputStateManager from './game/GameInputStateManager';
import { Panda } from './game/Panda';
import { SimpleTextFont, SimpleText } from './2d/SimpleText';
import { SimpleStage2D } from './2d/SimpleStage2D';
import { Juggler } from './animation/Juggler';
import { AnimatedMap } from './animation/AnimatedMap';
import { SimpleAnimatedSprite } from './2d/SimpleAnimatedSprite';
import { Base2DApp } from './game/Base2DApp';

// var SPECTOR = require('spectorjs');

class PandaGame extends Base2DApp {
  protected static _instance: PandaGame;
  static get instance(): PandaGame {
    if (this._instance === undefined) this._instance = new PandaGame();
    return this._instance;
  }

  activeSpritesGroup: SimpleGroup = new SimpleGroup();
  gameInput = GameInput.default;
  gameInputState = new GameInputStateManager(this.gameInput);

  panda: Panda;
  font: SimpleTextFont;
  text: SimpleText;
  fontTexture: SubTexture;

  textureGrid: SubTexture[];
  backgroundGrid: SimpleGrid;
  activeGrid: SimpleGrid;
  foregroundGrid: SimpleGrid;

  async init() {
    const gl = this._renderer.getGL();
    const texture = await GLTexture.load(gl, './images/dungeon.png');
    texture.active(0);

    this.textureGrid = createSubTextureGrid(texture, 16, 16);

    this.fontTexture = new SubTexture(texture, 0, 96, 128, 24);
    this.font = new SimpleTextFont(this.fontTexture, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.:-+', 8, 8);

    this.text = new SimpleText(this.font);
    this.text.upperCaseOnly = true;

    this.text.width = 72;

    this.text.text = 'Le gilles\nde ABCDEFGH';

    const tiledData = (await fetch('tiles/dungeon.json').then((response) => response.json())) as TiledMap;

    const bgData = tiledData.layers[0] as TiledTileLayer;
    const activeData = tiledData.layers[1] as TiledTileLayer;
    const fgData = tiledData.layers[2] as TiledTileLayer;

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
    this.activeGrid.x = activeData.x;
    this.activeGrid.y = activeData.y;

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
    this.juggler.addChildren(animatedMap);
    this.foregroundGrid.addIndexMapper(animatedMap.indexMapper);

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

    const animatedFlower = new SimpleAnimatedSprite(flowerAnimationTextures, 4, true);

    animatedFlower.setPosition(64, 64);

    animatedFlower.start();

    this.juggler.addChildren(animatedFlower);

    this.panda = new Panda(
      {
        down: textureDown,
        right: textureRight,
        up: textureUp,
        left: textureLeft,
      },
      this.gameInputState,
    );
    this.panda.x = 32;
    this.panda.y = 16;

    this.stage.addChild(this.backgroundGrid);
    this.stage.addChild(this.activeGrid);

    this.stage.addChild(this.activeSpritesGroup);
    this.stage.addChild(this.foregroundGrid);
    this.stage.gui.addChild(this.text);

    this.activeSpritesGroup.addChild(this.panda);
    this.activeSpritesGroup.addChild(animatedFlower);
  }

  update(time: number, elapsedTime: number): void {
    this.panda.update(this.backgroundGrid, this.activeGrid);
    const canvas = this.renderer.canvas;
    this.cam.setClampedPosition(this.panda.x - canvas.width / 2, this.panda.y - canvas.height / 2, 0, 432, 0, 320);
  }
  beforeRender(time: number, elapsedTime: number): void {
    // throw new Error('Method not implemented.');
  }
}

window.addEventListener('load', async () => {
  await PandaGame.instance.init();
  PandaGame.instance.start();
});
