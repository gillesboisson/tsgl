import { SimpleSprite } from './SimpleSprite';
import { IAnimated, IStartStopPause } from '../../animation/Juggler';
import { SubTexture } from '../SubTexture';

export class SimpleAnimatedSprite extends SimpleSprite implements IAnimated, IStartStopPause {
  protected _currentFrame: number;
  protected _playState: boolean;
  protected _t: number;
  protected _nbFrames: number;

  constructor(protected _textures: SubTexture[], protected _fps: number, protected _loop: boolean = false) {
    super(_textures[0]);
    this._currentFrame = 0;
    this._playState = false;
    this._t = 0;
    this._nbFrames = this._textures.length;
  }

  protected updateCurrentFrame(frame: number): void {
    this._currentFrame = frame;
    this._subTexture = this._textures[frame];
    this._texture = this._subTexture.glTexture.texture;
  }

  get loop(): boolean {
    return this._loop;
  }

  set loop(val: boolean) {
    if (this._loop !== val) {
      this._loop = val;
    }
  }

  get currentFrame(): number {
    return this._currentFrame;
  }
  get nbFrames(): number {
    return this._nbFrames;
  }

  get isPlaying(): boolean {
    return this._playState;
  }

  pause(): void {
    this._playState = false;
  }
  start(): void {
    this._playState = true;
  }
  stop(): void {
    this._playState = false;
    this._t = 0;
    this.updateCurrentFrame(0);
  }

  animationStart(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animationEnd(time: number): void {}

  animationUpdate(time: number, elapsedTime: number): void {
    if (this._playState === true) {
      const t = this._t + elapsedTime;
      let frame = Math.floor((t / 1000) * this._fps);
      if (frame >= this._nbFrames) {
        if (this._loop) {
          frame = frame % this._nbFrames;
        } else {
          frame = this._nbFrames - 1;
          this._playState = false;
        }
      }

      this._t = t;

      if (frame !== this._currentFrame) {
        this.updateCurrentFrame(frame);
      }
    }
  }
}
