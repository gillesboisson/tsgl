import { GLRenderer, GLRendererType } from '../gl/core/GLRenderer';
import { SpriteBatch } from '../2d/SpriteBatch';
import { SimpleStage2D } from '../2d/SimpleStage2D';
import { SpriteShader } from '../shaders/SpriteShader';
import { Juggler } from '../animation/Juggler';
import { Camera2D } from '../2d/Camera2D';

export abstract class Base2DApp {
  protected _renderer: GLRenderer;
  protected _batch: SpriteBatch;
  protected _stage: SimpleStage2D;
  protected _t0: number;
  protected _t: number;
  protected _juggler: Juggler;
  private __refresh: () => void;
  protected _active: boolean;
  protected _cam: Camera2D;

  get renderer(): GLRenderer {
    return this._renderer;
  }
  get batch(): SpriteBatch {
    return this._batch;
  }
  get stage(): SimpleStage2D {
    return this._stage;
  }

  get juggler(): Juggler {
    return this._juggler;
  }

  get active(): boolean {
    return this._active;
  }
  get cam(): Camera2D {
    return this._cam;
  }

  constructor(canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement) {
    const renderer = (this._renderer = GLRenderer.createFromCanvas(canvas, GLRendererType.WebGL2));

    let canvasRatio = canvas.height / canvas.width;
    let vpRatio = window.innerHeight / window.innerWidth;

    // update canvas size;
    if (vpRatio < canvasRatio) {
      canvas.style.height = window.innerHeight + 'px';
      canvas.style.width = window.innerHeight / canvasRatio + 'px';
    } else {
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerWidth * canvasRatio + 'px';
    }

    const gl = renderer.getGL() as WebGL2RenderingContext;

    renderer.registerShaderFactory(SpriteShader);

    const batch = (this._batch = new SpriteBatch(gl));
    const stage = (this._stage = new SimpleStage2D(renderer, batch, canvas.width, canvas.height));
    this._cam = stage.cam;

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    this._juggler = new Juggler();

    this.__refresh = () => this._refresh();
  }

  start() {
    this._t0 = this._t = new Date().getTime();
    this._active = true;
    this._juggler.start();
    this._refresh();
  }

  stop() {
    this._active = false;
    this._juggler.stop();
  }

  abstract update(time: number, elapsedTime: number): void;
  abstract beforeRender(time: number, elapsedTime: number): void;

  _refresh(requestAnimationFrame = true) {
    if (this._active === false) return;
    if (requestAnimationFrame) window.requestAnimationFrame(this.__refresh);

    const t1 = new Date().getTime();

    const elapsedTime = t1 - this._t;
    const time = t1 - this._t0;

    this.update(time, elapsedTime);
    this._juggler.update(elapsedTime);
    this._renderer.prepareFrame();
    this._renderer.clear();

    const elapsedTimeR = t1 - this._t;
    const timeR = t1 - this._t0;
    this.beforeRender(timeR, elapsedTimeR);
    this._stage.render();
    this._t = t1;
  }
}