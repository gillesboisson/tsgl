import { SimpleSprite } from '../2d/SimpleSprite';
import { SimpleAnimatedSprite } from '../2d/SimpleAnimatedSprite';
import { IAnimated } from '../animation/Juggler';
import { SubTexture } from '../2d/SubTexture';
import { IBombDropper } from './Panda';

export class Bomb extends SimpleSprite implements IAnimated {
  protected _time: number;
  protected _timeLimit: number;
  protected _animationTimeStart: number;
  protected _animationFrame: number;

  // events
  public onExplode: (bomb: Bomb) => void;

  constructor(
    textureOff: SubTexture,
    protected _traverseCrate: boolean,
    protected _explodeAnimTextures: SubTexture[],
    protected _dropper: IBombDropper,
  ) {
    super(textureOff);
    this.reset();
  }

  get traverseCrate(): boolean {
    return this._traverseCrate;
  }

  reset() {
    this._time = 0;
    this._timeLimit = 2000;
    this._animationTimeStart = this._timeLimit - 1000;
    this._animationFrame = 0;
  }

  explode() {
    this.onExplode(this);
    this._dropper.bombExploded(this);
  }

  animationUpdate(time: number, elapsedTime: number): void {
    this._time += elapsedTime;
    if (this._time >= this._timeLimit) {
      this.explode();
    }

    if (this._time >= this._animationTimeStart) {
      const animationFrame = Math.floor(this._time / 64) % this._explodeAnimTextures.length;
      if (animationFrame !== this._animationFrame) {
        this._animationFrame = animationFrame;
        this._subTexture = this._explodeAnimTextures[animationFrame];
        this._texture = this._subTexture.glTexture.texture;
      }
    }
  }

  // empty interface implementation
  animationStart(): void {}
  animationEnd(time: number): void {}
}
