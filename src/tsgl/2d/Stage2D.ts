import { ElementI, Group } from './Group';
import { Camera2D } from './Camera2D';
import { GLRenderer } from '../gl/core/GLRenderer';
import { IGLShaderState } from '../gl/core/shader/IGLShaderState';
import { ISpriteBatchPullable, SpriteBatch } from './SpriteBatch';
import { IGLSpriteShaderState } from '../shaders/SpriteShader';
import { IBatch } from '../helpers/IBatch';

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

export class SpriteLayer implements IRenderLayer<IGLSpriteShaderState, SpriteBatch> {
  readonly cam: Camera2D;

  readonly mainGroup: Group = new Group();

  constructor(
    readonly renderer: GLRenderer,
    readonly width: number,
    readonly height: number,
    readonly batch: SpriteBatch = new SpriteBatch(renderer.gl as WebGL2RenderingContext),
    readonly renderState: IGLSpriteShaderState = renderer.createShaderState('sprite'),
  ) {
    this.cam = new Camera2D(width, height);
  }

  addChild(child: ElementI<any, any>, renderOrder?: number): void {
    this.mainGroup.addChild(child, renderOrder);
  } 
  removeChild(child: ElementI<any, any>): void {
    this.mainGroup.removeChild(child);
  }

  render(cam?: Camera2D): void {
    this.batch.begin(this.renderState, cam || this.cam);
    this.mainGroup.draw(this.batch);
    this.batch.end();
  }
}
