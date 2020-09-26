import { vec2, vec4 } from 'gl-matrix';
import { GLTexture } from '../gl/core/GLTexture';
import { SimpleWorldCoords } from './SimpleWorldCoords';
import { SpriteBatchRenderable } from './SpriteBatch';
import { SimpleGroup } from './SimpleGroup';
import { SimpleSpriteBatch, SimpleSpriteBatchRenderable } from './SimpleSpriteBatch';

export abstract class SimpleElement implements SimpleSpriteBatchRenderable<SimpleWorldCoords> {
  protected position: vec2 = vec2.create();
  protected color: vec4 = vec4.fromValues(1, 1, 1, 1);
  _texture: WebGLTexture;
  public visible = true;
  public parent: SimpleGroup;

  protected _worldCoords: SimpleWorldCoords = {
    x: 0,
    y: 0,
    color: vec4.create(),
  };

  removeFromParent() {
    if (this.parent !== undefined) this.parent.removeChild(this);
  }

  constructor(texture: GLTexture) {
    if (texture) this._texture = texture.texture;
  }

  abstract draw(batch: SimpleSpriteBatch, parentWorldCoords?: SimpleWorldCoords): void;

  get x(): number {
    return this.position[0];
  }

  set x(val: number) {
    this.position[0] = val;
  }
  get y(): number {
    return this.position[1];
  }

  set y(val: number) {
    this.position[1] = val;
  }

  setPosition(x: number, y: number) {
    this.position[0] = x;
    this.position[1] = y;
  }

  calcWorldCoordinate(parentWorldCoords: SimpleWorldCoords) {
    const resultWorldCoords = this._worldCoords;
    if (parentWorldCoords === undefined) {
      resultWorldCoords.x = this.position[0];
      resultWorldCoords.y = this.position[1];
      vec4.copy(resultWorldCoords.color, this.color);
    } else {
      resultWorldCoords.x = this.position[0] + parentWorldCoords.x;
      resultWorldCoords.y = this.position[1] + parentWorldCoords.y;
      vec4.multiply(resultWorldCoords.color, this.color, parentWorldCoords.color);
    }
  }

  setColor(r: number, g: number, b: number, a: number) {
    vec4.set(this.color, r, g, b, a);
  }

  setColorBase255(r: number, g: number, b: number, a: number) {
    vec4.set(this.color, r / 255, g / 255, b / 255, a / 255);
  }

  getColor() {
    return vec4.clone(this.color);
  }
}
