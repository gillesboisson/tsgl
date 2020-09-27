import { SimpleGroup } from './SimpleGroup';
import { Camera2D } from '../Camera2D';
import { GLRenderer } from '../../gl/core/GLRenderer';
import { SpriteBatch } from '../SpriteBatch';
import { Stage2D } from '../Stage2D';

export class SimpleStage2D extends Stage2D {
  private _gui: SimpleGroup;

  constructor(
    renderer: GLRenderer,
    batch = new SpriteBatch(renderer.getGL() as WebGL2RenderingContext),
    width: number,
    height: number,
  ) {
    super(renderer, batch, width, height, renderer.createShaderState('simple_sprite'));
    this._gui = new SimpleGroup();
    this._guiCam = new Camera2D(width, height);
  }

  get gui(): SimpleGroup {
    return this._gui;
  }

  render(cam?: Camera2D): void {
    super.render(cam);

    this._batch.begin(this._renderState, this._guiCam);
    this._gui.draw(this._batch);
    this._batch.end();
  }
}
