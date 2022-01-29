import { IGLShaderState } from '@tsgl/gl';
import { IBatch } from './IBatch';

export interface IBatchPullable<
  MainShaderStateT extends IGLShaderState,
  BatchT extends IBatch<IBatchPullable<MainShaderStateT, BatchT, SpriteDataT, indicesT>, MainShaderStateT>,
  SpriteDataT,
  indicesT = Uint16Array
> {
  pull(batch: BatchT, vertices: SpriteDataT[], indices: indicesT, vertexIndex: number, indicesIndex: number): void;
}
