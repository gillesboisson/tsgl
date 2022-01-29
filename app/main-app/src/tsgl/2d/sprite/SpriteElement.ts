import { vec2, vec4, mat4, mat2d, mat2 } from 'gl-matrix';
import { IGLTexture } from '../../gl/core/texture/GLTexture';
import { WorldCoords } from './ElementData';
import { SpriteGroup } from './SpriteGroup';
import { SpriteBatch } from '../SpriteBatch';
import { ElementI } from '../Group';
// import { SpriteBatch, SpriteBatchRenderable } from './SpriteBatch';

export abstract class SpriteElement implements ElementI<SpriteGroup, WorldCoords> {
  protected _position: vec2 = vec2.create();
  protected _scale: vec2 = vec2.fromValues(1, 1);
  protected _anchor: vec2 = vec2.fromValues(0, 0);
  protected _size: vec2 = vec2.fromValues(1, 1);

  protected _rotation = 0;
  protected _dirtyMat = true;
  protected _dirtyRot = true;

  private _cx = 0;
  private _sx = 0;
  private _cy = 0;
  private _sy = 0;

  protected color: vec4 = vec4.fromValues(1, 1, 1, 1);
  _texture: WebGLTexture;
  public visible = true;
  public parent: SpriteGroup;

  protected _worldCoords: WorldCoords = {
    transform: mat2d.create(),
    color: vec4.create(),
  };

  protected _localMat = mat2d.create();

  removeFromParent(): void {
    if (this.parent !== undefined) this.parent.removeChild(this);
  }

  constructor(texture: IGLTexture) {
    if (texture) this._texture = texture.texture;
  }

  abstract draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void;

  get anchorX(): number {
    return this._anchor[0];
  }

  set anchorX(val: number) {
    if (val !== this._anchor[0]) {
      this._anchor[0] = val;
      this._dirtyMat = true;
    }
  }
  get anchorY(): number {
    return this._anchor[1];
  }

  set anchorY(val: number) {
    if (val !== this._anchor[1]) {
      this._anchor[1] = val;
      this._dirtyMat = true;
    }
  }

  get x(): number {
    return this._position[0];
  }

  set x(val: number) {
    if (val !== this._position[0]) {
      this._position[0] = val;
      this._dirtyMat = true;
    }
  }
  get y(): number {
    return this._position[1];
  }

  set y(val: number) {
    if (val !== this._position[1]) {
      this._position[1] = val;
      this._dirtyMat = true;
    }
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(val: number) {
    if (val !== this._rotation) {
      this._rotation = val;
      this._dirtyMat = true;
      this._dirtyRot = true;
    }
  }

  setPosition(x: number, y: number): void {
    if (this._position[0] !== x || this._position[1] !== y) {
      this._position[0] = x;
      this._position[1] = y;
      this._dirtyMat = true;
    }
  }

  setAnchor(x: number, y: number): void {
    if (this._anchor[0] !== x || this._anchor[1] !== y) {
      this._anchor[0] = x;
      this._anchor[1] = y;
      this._dirtyMat = true;
    }
  }

  setScale(x: number, y: number = x): void {
    if (this._scale[0] !== x || this._scale[1] !== y) {
      this._scale[0] = x;
      this._scale[1] = y;
      this._dirtyMat = true;
    }
  }

  updateRot(): void {
    this._dirtyRot = false;

    this._cx = Math.cos(this._rotation);
    this._sx = Math.sin(this._rotation);
    this._cy = -this._sx; // cos, added PI/2
    this._sy = this._cx; // sin, added PI/2
  }

  resize(width: number, height: number): boolean {
    if (this._size[width] !== width || this._size[1] !== height) {
      this._size[0] = width;
      this._size[1] = height;
      this._dirtyMat = true;
      return true;
    }
    return false;
  }

  updateLocalMat(force = this._dirtyMat): void {
    if (force) {
      if (this._dirtyRot) this.updateRot();

      const mt = this._localMat;
      const scale = this._scale;
      const position = this._position;
      const size = this._size;
      const pivot = this._anchor;

      // debugger;

      // apply rotation + scale
      mt[0] = this._cx * scale[0];
      mt[1] = this._sx * scale[0];
      mt[2] = this._cy * scale[1];
      mt[3] = this._sy * scale[1];

      // calc pivot offset
      const px = size[0] !== 0 ? pivot[0] * size[0] : pivot[0];
      const py = size[1] !== 0 ? pivot[1] * size[1] : pivot[1];

      //  apply translation
      mt[4] = position[0] - (px * mt[0] + py * mt[2]);
      mt[5] = position[1] - (px * mt[1] + py * mt[3]);
      // mt[4] = position[0];
      // mt[5] = position[1];
      this._dirtyMat = false;

      // debugger;
    }
  }

  calcWorldCoordinate(parentWorldCoords: WorldCoords): void {
    const resultWorldCoords = this._worldCoords;
    this.updateLocalMat();
    if (parentWorldCoords === undefined) {
      vec4.copy(resultWorldCoords.color, this.color);
      mat2d.copy(resultWorldCoords.transform, this._localMat);
    } else {
      vec4.multiply(resultWorldCoords.color, this.color, parentWorldCoords.color);
      mat2d.multiply(resultWorldCoords.transform, parentWorldCoords.transform, this._localMat);
    }
  }

  setColor(r: number, g: number, b: number, a: number): void {
    vec4.set(this.color, r, g, b, a);
  }

  setColorBase255(r: number, g: number, b: number, a: number): void {
    vec4.set(this.color, r / 255, g / 255, b / 255, a / 255);
  }

  getColor(): vec4 {
    return vec4.clone(this.color);
  }
}
