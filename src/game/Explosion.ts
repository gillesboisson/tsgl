import { IAnimated } from '../animation/Juggler';
import { SimpleGrid } from '../2d/simpleSprite/SimpleGrid';
import { ExplosionMap } from './ExplosionMap';
import { CollisionManager, CollisionFlag } from './CollisionManager';

const EXPLOSION_PROPAGATION_SPEED = 16;

export const H_BITFLAG = 0b00000011;
export const V_BITFLAG = 0b00001100;

const TTL = 1000;

export class Explosion implements IAnimated {
  protected _animationProgress: number;
  protected _currentLength: number;
  protected _collisionManager: CollisionManager;

  onComplete: (explosion: Explosion) => void;

  public constructor(
    protected _x: number,
    protected _y: number,
    protected _length: number,
    protected _traverseCrate: boolean,

    protected _activeGrid: SimpleGrid,
    protected _explosion: ExplosionMap,
    protected _foregroundGrid: SimpleGrid,
    protected _backgroundGrid: SimpleGrid,
  ) {
    this._explosion.addExplosionAt(_x, _y, H_BITFLAG | V_BITFLAG);
    this._collisionManager = CollisionManager.defaultInstance;
    this._animationProgress = 0;
    this.updateLength(_length);
  }
  checkFoCratesToDestroy(x: number, y: number) {
    return;
  }

  protected updateLength(length: number) {
    let topHit = false;
    let bottompHit = false;
    let leftHit = false;
    let rightHit = false;
    this._currentLength = length;

    let tX, tY: number;
    const cm = this._collisionManager;
    for (let i = 1; i <= length; i++) {
      if (!topHit) {
        tX = this._x;
        tY = this._y - i;

        if (cm.hasFlag(tX, tY, CollisionFlag.Wall)) {
          topHit = true;
        } else {
          topHit = this._explosion.addExplosionAt(tX, tY, V_BITFLAG) && !this._traverseCrate;
        }
      }
      if (!bottompHit) {
        tX = this._x;
        tY = this._y + i;
        if (cm.hasFlag(tX, tY, CollisionFlag.Wall)) {
          bottompHit = true;
        } else {
          bottompHit = this._explosion.addExplosionAt(tX, tY, V_BITFLAG) && !this._traverseCrate;
        }
      }

      if (!leftHit) {
        tX = this._x - i;
        tY = this._y;
        if (cm.hasFlag(tX, tY, CollisionFlag.Wall)) {
          leftHit = true;
        } else {
          leftHit = this._explosion.addExplosionAt(tX, tY, H_BITFLAG) && !this._traverseCrate;
        }
      }

      if (!rightHit) {
        tX = this._x + i;
        tY = this._y;
        if (cm.hasFlag(tX, tY, CollisionFlag.Wall)) {
          rightHit = true;
        } else {
          rightHit = this._explosion.addExplosionAt(tX, tY, H_BITFLAG) && !this._traverseCrate;
        }
      }
    }
  }

  protected clearGrid() {
    let topHit = false;
    let bottompHit = false;
    let leftHit = false;
    let rightHit = false;
    const length = this._currentLength;
    const cm = this._collisionManager;

    let tX, tY: number;
    this._explosion.removeExplosionAt(this._x, this._y);
    for (let i = 1; i <= length; i++) {
      if (!topHit) {
        tX = this._x;
        tY = this._y - i;
        if (cm.isWall(tX, tY)) {
          topHit = true;
        } else {
          this._explosion.removeExplosionAt(tX, tY);
        }
      }
      if (!bottompHit) {
        tX = this._x;
        tY = this._y + i;
        if (cm.isWall(tX, tY)) {
          bottompHit = true;
        } else {
          this._explosion.removeExplosionAt(tX, tY);
        }
      }

      if (!leftHit) {
        tX = this._x - i;
        tY = this._y;
        if (cm.isWall(tX, tY)) {
          leftHit = true;
        } else {
          this._explosion.removeExplosionAt(tX, tY);
        }
      }

      if (!rightHit) {
        tX = this._x + i;
        tY = this._y;
        if (cm.isWall(tX, tY)) {
          rightHit = true;
        } else {
          this._explosion.removeExplosionAt(tX, tY);
        }
      }
    }
  }

  animationUpdate(time: number, elapsedTime: number): void {
    this._animationProgress += elapsedTime;
    const currentLength = Math.floor(this._animationProgress / EXPLOSION_PROPAGATION_SPEED) + 1;

    if (currentLength <= this._length) {
      // if (currentLength !== this._currentLength) {
      //   this.updateLength(currentLength);
      // }
    } else if (this._animationProgress >= TTL + this._length * EXPLOSION_PROPAGATION_SPEED) {
      this.clearGrid();
      this.onComplete(this);
    }
  }

  animationStart(): void {}
  animationEnd(time: number): void {}
}
