import { SimpleGrid } from '../2d/simpleSprite/SimpleGrid';
import { Bomb } from './Bomb';
import { DebuggerText } from './DebuggerText';

export enum CollisionFlag {
  Bomb = 0b00000001,
  Crate = 0b00000010,
  Wall = 0b00000100,
  Explosion = 0b00001000,
  Item = 0b00010000,
  Enemy = 0b00100000,
  Player = 0b01000000,
  Exit = 0b10000000,
}

const BLOCKING_FLAG = CollisionFlag.Bomb | CollisionFlag.Crate | CollisionFlag.Wall;

export class CollisionManager {
  protected static _defaultInstance: CollisionManager;
  onCrateExplode: (x: number, y: number) => void;
  onBombFired: (x: number, y: number) => void;
  onItemExplode: (x: number, y: number) => void;

  static get defaultInstance(): CollisionManager {
    if (this._defaultInstance === undefined) {
      this._defaultInstance = new CollisionManager();
    }

    return this._defaultInstance;
  }

  protected _grid: number[];
  protected _nbElementX: number;
  protected _nbElementY: number;

  get grid(): number[] {
    return this._grid;
  }

  loadMap(backgroundGrid: SimpleGrid, foregroundGrid: SimpleGrid, itemsGrid: SimpleGrid, activeGrid: SimpleGrid) {
    this._nbElementX = activeGrid.nbElementX;
    this._nbElementY = activeGrid.nbElementY;
    const length = this._nbElementX * this._nbElementY;
    const grid = (this._grid = new Array(length));

    const activeGridData = activeGrid.grid;
    const backgroundGridData = backgroundGrid.grid;
    const foregroundGridData = foregroundGrid.grid;
    const itemsGridData = itemsGrid.grid;

    for (let i = 0; i < length; i++) {
      grid[i] =
        0 |
        (backgroundGridData[i] > 16 || foregroundGridData[i] > 16 ? CollisionFlag.Wall : 0) |
        (itemsGridData[i] !== 0 && itemsGridData[i] <= 128 ? CollisionFlag.Item : 0) |
        (itemsGridData[i] == 242 ? CollisionFlag.Exit : 0) |
        (activeGridData[i] === 30 ? CollisionFlag.Crate : 0);
    }
  }

  updateAreaFlag(
    oldX: number,
    oldY: number,
    newX: number,
    newY: number,
    width: number,
    height: number,
    flag: number,
    collisionFlags?: number,
    onHitFlag?: (gridX: number, gridY: number, flags: number) => void,
  ) {
    const nbElementX = this._nbElementX;
    const nbElementY = this._nbElementY;
    const tileWidth = 16;
    const tileHeight = 16;
    const grid = this._grid;
    const itemFlag = flag;
    const invItemFlag = ~flag;

    const oldGridLeft = Math.floor(oldX / tileWidth);
    const oldGridTop = Math.floor(oldY / tileHeight);
    const oldGridRight = Math.floor((oldX + width) / tileWidth);
    const oldGridBottom = Math.floor((oldY + height) / tileHeight);

    let newGridLeft = oldGridLeft;
    let newGridTop = oldGridTop;
    let newGridRight = oldGridRight;
    let newGridBottom = oldGridBottom;

    if (oldX !== newX) {
      newGridLeft = Math.floor(newX / tileWidth);
      newGridRight = Math.floor((newX + width) / tileWidth);
    }

    if (oldY !== newY) {
      newGridTop = Math.floor(newY / tileHeight);
      newGridBottom = Math.floor((newY + height) / tileHeight);
    }

    const indTL = newGridLeft + newGridTop * nbElementX;
    const indTR = newGridRight + newGridTop * nbElementX;
    const indBL = newGridLeft + newGridBottom * nbElementX;
    const indBR = newGridRight + newGridBottom * nbElementX;

    if (oldX !== newX || oldY !== newY) {
      grid[oldGridLeft + oldGridTop * nbElementX] &= invItemFlag;
      grid[oldGridLeft + oldGridBottom * nbElementX] &= invItemFlag;
      grid[oldGridRight + oldGridTop * nbElementX] &= invItemFlag;
      grid[oldGridRight + oldGridBottom * nbElementX] &= invItemFlag;

      grid[indTL] |= itemFlag;
      grid[indBL] |= itemFlag;
      grid[indTR] |= itemFlag;
      grid[indBR] |= itemFlag;
    }

    if (collisionFlags !== undefined) {
      if ((grid[indTL] & collisionFlags) !== 0) onHitFlag(newGridLeft, newGridTop, grid[indTL] & collisionFlags);
      if (newGridLeft !== newGridRight && (grid[indTR] & collisionFlags) !== 0)
        onHitFlag(newGridRight, newGridTop, grid[indTR] & collisionFlags);
      if (newGridTop !== newGridBottom && (grid[indBL] & collisionFlags) !== 0)
        onHitFlag(newGridLeft, newGridBottom, grid[indBL] & collisionFlags);
      if (newGridLeft !== newGridRight && newGridTop !== newGridBottom && (grid[indBR] & collisionFlags) !== 0)
        onHitFlag(newGridRight, newGridBottom, grid[indBR] & collisionFlags);
    }
    // }
  }

  setFlag(x: number, y: number, flag: number) {
    const ind = x + y * this._nbElementX;
    this._grid[ind] |= flag;
  }

  unsetFlag(x: number, y: number, flag: number) {
    const ind = x + y * this._nbElementX;
    this._grid[ind] &= ~flag;
  }

  isWall(x: number, y: number, flag = BLOCKING_FLAG) {
    return (this._grid[x + y * this._nbElementX] & flag) !== 0;
  }

  hasFlag(x: number, y: number, flag: number) {
    return (this._grid[x + y * this._nbElementX] & flag) !== 0;
  }

  setExplosion(x: number, y: number): boolean {
    const ind = x + y * this._nbElementX;
    const collisionInd = this._grid[ind];
    const isCrate = (collisionInd & CollisionFlag.Crate) !== 0;
    if (isCrate) this.onCrateExplode(x, y);
    this._grid[ind] |= CollisionFlag.Explosion;

    if ((collisionInd & CollisionFlag.Item) !== 0) {
      this.onItemExplode(x, y);
    }
    if ((collisionInd & CollisionFlag.Bomb) !== 0) {
      this.onBombFired(x, y);
    }

    return isCrate;
  }
}
