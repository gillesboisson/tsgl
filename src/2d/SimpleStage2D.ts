import { SimpleGroup } from './SimpleGroup';
import { Camera2D } from './Camera2D';
import { SpriteBatch } from './SpriteBatch';
import { GLRenderer } from '../gl/core/GLRenderer';
import { SpriteShaderState } from '../shaders/SpriteShader';
import { Camera } from '../gltf-schema';
import { SimpleSpriteBatch } from './SimpleSpriteBatch';

export class SimpleStage2D extends SimpleGroup {
  protected _cam: Camera2D;
  protected _renderState: SpriteShaderState;
  protected _gui: SimpleGroup;
  protected _guiCam: Camera2D;
  constructor(
    protected _renderer: GLRenderer,
    protected _batch = new SimpleSpriteBatch(_renderer.getGL() as WebGL2RenderingContext),
    protected _width: number,
    protected _height: number,
  ) {
    super();
    this._cam = new Camera2D(_width, _height);
    this._renderState = _renderer.createShaderState('simple_sprite');
    this._gui = new SimpleGroup();
    this._guiCam = new Camera2D(_width, _height);
  }

  get cam(): Camera2D {
    return this._cam;
  }

  get gui(): SimpleGroup {
    return this._gui;
  }

  render(cam?: Camera2D) {
    this._batch.begin(this._renderState, cam || this._cam);
    super.draw(this._batch);
    this._batch.end();

    this._batch.begin(this._renderState, this._guiCam);
    this._gui.draw(this._batch);
    this._batch.end();
  }
}
