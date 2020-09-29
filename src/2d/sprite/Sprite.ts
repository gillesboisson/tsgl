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
}
