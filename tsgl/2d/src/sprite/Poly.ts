import { SpriteElement } from './SpriteElement';
import { IGLTexture } from '@tsgl/gl';

export abstract class Poly extends SpriteElement {
  constructor(texture: IGLTexture, readonly nbTriangles: number, readonly nbPoints: number) {
    super(texture);
  }

  // draw(batch: SpriteBatch, parentWorldCoords?: WorldCoords): void {
  //   throw new Error('Method not implemented.');
  // }
}
