import { SpriteElement } from './SpriteElement';
import { SpriteBatch } from '../SpriteBatch';
import { WorldCoords } from './ElementData';
import { GLTexture } from '../../gl/core/GLTexture';

export abstract class Poly extends SpriteElement {
  constructor(texture: GLTexture, readonly nbTriangles: number, readonly nbPoints: number) {
    super(texture);
  }

  // draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
  //   throw new Error('Method not implemented.');
  // }
}
