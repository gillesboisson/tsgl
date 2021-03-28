// import { SpriteBatchPullable, SpriteBatch, SpriteBatchData } from './SpriteBatch';
import { SubTexture } from '../SubTexture';
import { Quad } from './Quad';

export class Sprite extends Quad {
  protected _subTexture: SubTexture;

  constructor(subTexture: SubTexture) {
    super(subTexture.glTexture);
    this.subTexture = subTexture;
  }

  get subTexture(): SubTexture {
    return this._subTexture;
  }

  set subTexture(val: SubTexture) {
    if (this._subTexture !== val) {
      if (val) {
        this.resize(val.width, val.height);
        this._uvs.set(val.uv);
      } else {
        this.resize(1, 1);
      }
      this._subTexture = val;
      this._texture = val.glTexture.texture;
    }
  }

  setSize(width: number, height: number): void {
    if (this.subTexture) {
      this.setScale(width / this.subTexture.width, height / this.subTexture.height);
    }
  }

  set width(width: number) {
    if (this.subTexture) {
      this.scaleX = width / this.subTexture.width;
    }
  }
  get width(): number {
    if (this.subTexture) {
      return this.subTexture.width * this._scale[0];
    }

    return -1;
  }
  get height(): number {
    if (this.subTexture) {
      return this.subTexture.height * this._scale[1];
    }

    return -1;
  }
  set height(height: number) {
    if (this.subTexture) {
      this.scaleY = height / this.subTexture.height;
    }
  }
}
