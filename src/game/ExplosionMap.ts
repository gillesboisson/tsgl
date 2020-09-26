import { SimpleGrid, createConvolutionGridIndexMapper } from '../2d/SimpleGrid';
import { SubTexture } from '../2d/SubTexture';
import { Camera2D } from '../2d/Camera2D';
import { H_BITFLAG, V_BITFLAG } from './Explosion';
import { IAnimated } from '../animation/Juggler';
import { CollisionManager, CollisionFlag } from './CollisionManager';

const ORIENTATION_MASK = 0b00001111;
const FACTOR_MASK = 0b11110000;
const FACTOR_MUL = 0b00010000;

const LEFT_TILE_END = 10;
const HORIZONTAL_TILE = 11;
const CENTER_TILE = 12;
const RIGHT_TILE_END = 13;
const TOP_TILE_END = 26;
const VERTICAL_TILE = 27;
const BOTTOM_TILE_END = 28;

const LEFT_TILE_END_FLAG = 0b00000010;
const HORIZONTAL_TILE_FLAG = 0b00000011;
const RIGHT_TILE_END_FLAG = 0b00000001;
const TOP_TILE_END_FLAG = 0b00001000;
const VERTICAL_TILE_FLAG = 0b00001100;
const BOTTOM_TILE_END_FLAG = 0b00000100;

const ANIMAION_CYCLE = 64;

// prettier-ignore
const SPRITE_KERNEL = [
  0           ,0b00000100   ,0,
  0b00000001  ,FACTOR_MASK  ,0b00000010,
  0           ,0b00001000   ,0
  ]

export const kernelCompare = createConvolutionGridIndexMapper(
  SPRITE_KERNEL,
  3,
  3,
  (base, val, kernel, x, y, size) => base | (val & kernel),
);

export function explosionTile(
  ind: number,
  x: number,
  y: number,
  data: number[],
  gridWidth: number,
  gridHeight: number,
) {
  if (data[x + y * gridWidth] !== 0) {
    const orientation = ind & ORIENTATION_MASK;

    switch (orientation) {
      case LEFT_TILE_END_FLAG:
        return LEFT_TILE_END;

      case HORIZONTAL_TILE_FLAG:
        return HORIZONTAL_TILE;

      case RIGHT_TILE_END_FLAG:
        return RIGHT_TILE_END;

      case TOP_TILE_END_FLAG:
        return TOP_TILE_END;

      case VERTICAL_TILE_FLAG:
        return VERTICAL_TILE;

      case BOTTOM_TILE_END_FLAG:
        return BOTTOM_TILE_END;

      default:
        return CENTER_TILE;
    }
  } else {
    return 0;
  }
}

export class ExplosionMap extends SimpleGrid implements IAnimated {
  protected _frame: number;
  protected _collisionManager: CollisionManager;
  constructor(
    textures: SubTexture[],
    nbElementX: number,
    nbElementY: number,
    tileWidth: number,
    tileHeight: number,
    cam: Camera2D,
  ) {
    const length = nbElementX * nbElementY;
    const grid: number[] = new Array(length);
    for (let i = 0; i < length; i++) grid[i] = 0;
    super(textures, grid, nbElementX, nbElementY, tileWidth, tileHeight, cam);

    this._frame = 0;
    this._collisionManager = CollisionManager.defaultInstance;
    this.addIndexMapper(kernelCompare);
    this.addIndexMapper(explosionTile);
    this.addIndexMapper((ind) => ind + this._frame * 32); // implementation sec frame swap (2 rows offset  : 2 x 16)
  }

  addExplosionAt(x: number, y: number, orientationFlag: number): boolean {
    const gridInd = x + y * this._nbElementX;
    let nbExplosion = this._grid[gridInd];

    nbExplosion += FACTOR_MUL;
    this._grid[gridInd] = nbExplosion | orientationFlag;
    return this._collisionManager.setExplosion(x, y);
  }

  removeExplosionAt(x: number, y: number) {
    const gridInd = x + y * this._nbElementX;
    let nbExplosion = this._grid[gridInd] & FACTOR_MASK;
    let orientationFlag = this._grid[gridInd] & ORIENTATION_MASK;

    nbExplosion -= FACTOR_MUL;
    if (nbExplosion > 0) {
      this._grid[gridInd] = nbExplosion | orientationFlag;
    } else {
      this._collisionManager.unsetFlag(x, y, CollisionFlag.Explosion);
      this._grid[gridInd] = 0;
    }
  }

  animationUpdate(time: number, elapsedTime: number): void {
    this._frame = Math.floor(time / ANIMAION_CYCLE) % 2;
  }
  animationStart(): void {}
  animationEnd(time: number): void {}
}
