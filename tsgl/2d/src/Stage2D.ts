import { Group } from './Group';
import { Camera2D } from './Camera2D';
import { GLRenderer } from '@tsgl/gl';
import { IGLShaderState } from '@tsgl/gl';
import { ISpriteBatchPullable, SpriteBatch } from './SpriteBatch';
import { IBatch } from '@tsgl/common';
import { SpriteShaderState } from './shaders/sprite/SpriteShaderState';

export interface IStage {
  readonly cam: Camera2D;
  render(cam?: Camera2D): void;
}

interface IRenderLayer<ShaderStateT extends IGLShaderState, BatchT extends IBatch<ISpriteBatchPullable, ShaderStateT>> {
  readonly cam: Camera2D;
  readonly renderState: ShaderStateT;
  readonly batch: BatchT;
  readonly width: number;
  readonly height: number;

  render(cam?: Camera2D): void;
}

export class SpriteLayer implements IRenderLayer<SpriteShaderState, SpriteBatch> {
  readonly cam: Camera2D;

  readonly mainGroup: Group = new Group();

  constructor(
    readonly renderer: GLRenderer,
    readonly width: number,
    readonly height: number,
    readonly batch: SpriteBatch = new SpriteBatch(renderer.gl as WebGL2RenderingContext),
    readonly renderState: SpriteShaderState = renderer.createShaderState('sprite'),
  ) {
    this.cam = new Camera2D(width, height);
  }

  render(cam?: Camera2D): void {
    this.batch.begin(this.renderState, cam || this.cam);
    this.mainGroup.draw(this.batch);
    this.batch.end();
  }
}
