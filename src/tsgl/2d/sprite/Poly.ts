import { SpriteElement } from './SpriteElement';
import { SpriteBatch } from '../SpriteBatch';
import { WorldCoords } from './ElementData';
import { IGLTexture } from '../../gl/core/texture/GLTexture';

export abstract class Poly extends SpriteElement {
  constructor(texture: IGLTexture, readonly nbTriangles: number, readonly nbPoints: number) {
    super(texture);
  }

  // draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
  //   throw new Error('Method not implemented.');
  // }
}
