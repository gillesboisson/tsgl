import { SpriteGroup } from './SpriteGroup';
import { Camera2D } from '../Camera2D';
import { GLRenderer } from '@tsgl/gl';
import { SpriteBatch } from '../SpriteBatch';
import { SpriteLayer } from '../Stage2D';

export class SpriteStage2D extends SpriteLayer {
  readonly gui: SpriteGroup;
  readonly guiCam: Camera2D;

  constructor(
    renderer: GLRenderer,
    batch = new SpriteBatch(renderer.gl as WebGL2RenderingContext),
    width: number,
    height: number,
  ) {
    super(renderer, width, height, batch, renderer.createShaderState('simple_sprite'));
    this.gui = new SpriteGroup();
    this.guiCam = new Camera2D(width, height);
  }

  render(cam?: Camera2D): void {
    super.render(cam);

    this.batch.begin(this.renderState, this.guiCam);
    this.gui.draw(this.batch);
    this.batch.end();
  }
}
