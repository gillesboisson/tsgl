import { SimpleSprite } from '../2d/SimpleSprite';
import { SimpleGrid } from '../2d/SimpleGrid';
import { SubTexture } from '../2d/SubTexture';
import GameInputStateManager, { GameInputState } from './GameInputStateManager';
import { CollisionManager, CollisionFlag } from './CollisionManager';
import { DebuggerText } from './DebuggerText';
import { Bomb } from './Bomb';
import { IAnimated } from '../animation/Juggler';

const HIT_BOX_LEFT = 4;
const HIT_BOX_TOP = 20;
const HIT_BOX_WIDTH = 8;
const HIT_BOX_HEIGHT = 8;
const INVINCIBLE_TIME = 3000;
const TINKING_TIME = 32;

export enum PandaPowerUp {
  Speed = 67,
  Bomb = 68,
  Flame = 69,
  Wall = 70,
  Life = 71,
  Random1 = 72,
  Ramdom2 = 73,
}

const MIN_ITEM_IND = PandaPowerUp.Speed;
const MAX_ITEM_IND = PandaPowerUp.Life;

export interface IBombDropper {
  bombExploded(bomb: Bomb): void;
}

export class Panda extends SimpleSprite implements IBombDropper {
  protected _wallAround: boolean[] = new Array(9);
  protected _orientation = { x: 0, y: 1 };
  protected _collisionManager: CollisionManager;

  protected _oldX: number = 0;
  protected _oldY: number = 0;
  protected _x: number = 0;
  protected _y: number = 0;

  protected _bombLength: number;
  protected _traverseCrate: boolean;
  protected _life: number;
  protected _speed: number;
  protected _maxBombs: number;
  protected _invincible: boolean;
  protected _invincibleTime: number;

  // events
  onDropBomb: (gridX: number, grid: number) => boolean;
  onDead: () => void;
  onHitGridActiveElement: (gridX: number, gridY: number, flags: number) => void;

  constructor(
    protected textures: { left: SubTexture; right: SubTexture; up: SubTexture; down: SubTexture },
    protected spawnPoint: { x: number; y: number },
  ) {
    super(textures.down);
    this._collisionManager = CollisionManager.defaultInstance;
    this.resetStats();
    spawnPoint.y -= 1;
    this.x = spawnPoint.x * 16;
    this.y = spawnPoint.y * 16;
  }

  // accessors
  get traverseCrate(): boolean {
    return this._traverseCrate;
  }

  get bombLength(): number {
    return this._bombLength;
  }

  get x(): number {
    return this._x;
  }

  set x(val: number) {
    if (this._x !== val) {
      this._x = val;
      this.position[0] = Math.floor(val);
    }
  }

  get y(): number {
    return this._y;
  }

  set y(val: number) {
    if (this._y !== val) {
      this._y = val;
      this.position[1] = Math.floor(val);
    }
  }

  bombExploded(bomb: Bomb): void {
    this._maxBombs++;
  }

  resetStats() {
    this._bombLength = 1;
    this._traverseCrate = false;
    this._life = 2;
    this._speed = 1;
    this._maxBombs = 1;
    this._invincible = false;
  }

  handlePowerUp(powerUp: PandaPowerUp) {
    switch (powerUp) {
      case PandaPowerUp.Speed:
        this._speed += 0.3333333;
        break;
      case PandaPowerUp.Bomb:
        this._maxBombs++;
        break;
      case PandaPowerUp.Flame:
        this._bombLength++;
        break;
      case PandaPowerUp.Wall:
        this._traverseCrate = true;
        break;
      case PandaPowerUp.Life:
        this._life++;
        break;
      default:
        const ind = Math.floor(Math.random() * (MAX_ITEM_IND - MIN_ITEM_IND + 0.99999999)) + MIN_ITEM_IND;
        this.handlePowerUp(ind);
        break;
    }
  }

  explosionHit() {
    if (!this._invincible) {
      this._life--;
      if (this._life <= 0) this.onDead();
      this._invincible = true;
      this._invincibleTime = INVINCIBLE_TIME;
    } else {
      this.x = this.spawnPoint.x * 16;
      this.y = this.spawnPoint.y * 16;
      this._orientation.x = 0;
      this._orientation.y = 1;
    }
  }

  updateWallAround(gridPosX: number, gridPosY: number) {
    const cm = this._collisionManager;
    for (let i = 0; i < 9; i++) {
      this._wallAround[i] = cm.isWall((i % 3) + gridPosX - 1, Math.floor(i / 3) + gridPosY - 1);
    }
  }

  protected move(xOffset: number, yOffset: number, autoplace = false) {
    this._orientation.x = this._orientation.y = 0;
    switch (true) {
      case xOffset == 1:
        this.subTexture = this.textures.right;
        this._orientation.x = 1;
        break;
      case xOffset == -1:
        this.subTexture = this.textures.left;
        this._orientation.x = -1;
        break;
      case yOffset == 1:
        this.subTexture = this.textures.down;
        this._orientation.y = 1;
        break;
      case yOffset == -1:
        this.subTexture = this.textures.up;
        this._orientation.y = -1;
        break;
      default:
        this._orientation.y = 1;
        break;
    }

    this.x = autoplace ? Math.floor(this.x + xOffset) : this.x + xOffset * this._speed;
    this.y = autoplace ? Math.floor(this.y + yOffset) : this.y + yOffset * this._speed;
  }

  update(inputState: GameInputState, bgmap: SimpleGrid, activemap: SimpleGrid, time: number, elapsedTime: number) {
    const gridPosX = this.x / 16;
    const gridPosY = this.y / 16 + 1;

    const roundGridPosX = Math.round(gridPosX);
    const roundGridPosY = Math.round(gridPosY);

    const coordRoundOffsetX = roundGridPosX === gridPosX ? 0 : roundGridPosX > gridPosX ? -1 : 1;
    const coordRoundOffsetY = roundGridPosY === gridPosY ? 0 : roundGridPosY > gridPosY ? -1 : 1;

    let moved = false;

    if (inputState.d_pad_left) {
      this.updateWallAround(Math.ceil(gridPosX), roundGridPosY);
      if (!this._wallAround[3]) {
        moved = true;
        if (!this._wallAround[3 + coordRoundOffsetY * 3]) {
          this.move(-1, 0);
        } else {
          this.move(0, -coordRoundOffsetY, true);
        }
      }
    }

    if (inputState.d_pad_right && !moved) {
      this.updateWallAround(Math.floor(gridPosX), roundGridPosY);
      if (!this._wallAround[5]) {
        moved = true;

        if (!this._wallAround[5 + coordRoundOffsetY * 3]) {
          this.move(1, 0);
        } else {
          this.move(0, -coordRoundOffsetY, true);
        }
      }
    }

    if (inputState.d_pad_up && !moved) {
      this.updateWallAround(roundGridPosX, Math.ceil(gridPosY));
      if (!this._wallAround[1]) {
        moved = true;

        if (!this._wallAround[1 + coordRoundOffsetX]) {
          this.move(0, -1);
        } else {
          this.move(-coordRoundOffsetX, 0, true);
        }
      }
    }

    if (inputState.d_pad_down && !moved) {
      this.updateWallAround(roundGridPosX, Math.floor(gridPosY));
      if (!this._wallAround[7]) {
        if (!this._wallAround[7 + coordRoundOffsetX]) {
          this.move(0, 1);
        } else {
          this.move(-coordRoundOffsetX, 0, true);
        }
      }
    }

    if (inputState.button_1) {
      const bombPositionY = Math.round(this.y / 16) + this._orientation.y + 1;
      const bombPositionX = Math.round(this.x / 16) + this._orientation.x;

      if (this._maxBombs > 0 && this.onDropBomb(bombPositionX, bombPositionY)) {
        this._maxBombs--;
      }
      inputState.button_1 = false;
    }

    if (this._invincible) {
      this._invincibleTime -= elapsedTime;
      if (this._invincibleTime < 0) {
        this._invincible = false;
        this.visible = true;
      } else {
        this.visible = Math.floor(time / TINKING_TIME) % 2 !== 0;
      }
    }

    DebuggerText.defaultInstance.log(
      `Panda ${Math.round(this.x)} ${Math.round(this.y)} : LIFE ${this._life} BOMBS ${this._maxBombs} FLAME ${
        this._bombLength
      }`,
    );

    this._collisionManager.updateAreaFlag(
      this._oldX + HIT_BOX_LEFT,
      this._oldY + HIT_BOX_TOP,
      this.x + HIT_BOX_LEFT,
      this.y + HIT_BOX_TOP,
      HIT_BOX_WIDTH,
      HIT_BOX_HEIGHT,
      CollisionFlag.Player,
      CollisionFlag.Item | CollisionFlag.Explosion | CollisionFlag.Exit,
      this.onHitGridActiveElement,
    );

    this._oldX = this.x;
    this._oldY = this.y;
  }
}
