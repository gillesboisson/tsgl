import { Group } from './Group';
import { Camera2D } from './Camera2D';
import { GLRenderer } from '../gl/core/GLRenderer';
import { SpriteShaderState } from '../shaders/SpriteShader';
import { SpriteBatch } from './SpriteBatch';

export interface IStage {
  cam: Camera2D;
  render(cam?: Camera2D): void;
}

export class Stage2D extends Group implements IStage {
  protected _cam: Camera2D;
  protected _guiCam: Camera2D;
  constructor(
    protected _renderer: GLRenderer,
    protected _batch = new SpriteBatch(_renderer.getGL() as WebGL2RenderingContext),
    protected _width: number,
    protected _height: number,
    protected _renderState: SpriteShaderState = _renderer.createShaderState('sprite'),
  ) {
    super();
    this._cam = new Camera2D(_width, _height);
    this._guiCam = new Camera2D(_width, _height);
  }

  get cam(): Camera2D {
    return this._cam;
  }

  render(cam?: Camera2D): void {
    this._batch.begin(this._renderState, cam || this._cam);
    super.draw(this._batch);
    this._batch.end();
  }
}
