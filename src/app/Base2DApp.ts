import { Camera2D } from '../tsgl/2d/Camera2D';
import { SpriteBatch } from '../tsgl/2d/SpriteBatch';
import { SpriteLayer } from '../tsgl/2d/Stage2D';
import { Juggler } from '../tsgl/animation/Juggler';
import { GLRenderer, GLRendererType } from '../tsgl/gl/core/GLRenderer';
import { GLSupport } from '../tsgl/gl/core/GLSupport';
import { SimpleSpriteShader } from '../tsgl/shaders/SimpleSpriteShader';
import { SpriteShader } from '../tsgl/shaders/SpriteShader';

export abstract class Base2DApp {
  protected _renderer: GLRenderer;
  protected _batch: SpriteBatch;
  protected _stage: SpriteLayer;
  protected _t0: number;
  protected _t: number;
  protected _juggler: Juggler;
  private __refresh: () => void;
  protected _active: boolean;
  protected _cam: Camera2D;

  constructor(canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement) {
    const renderer = (this._renderer = GLRenderer.createFromCanvas(canvas, GLRendererType.WebGL));
    GLSupport.VAOSupported(this._renderer.gl, true, true);
    // let canvasRatio = canvas.height / canvas.width;
    // let vpRatio = window.innerHeight / window.innerWidth;
    // update canvas size;
    // if (vpRatio < canvasRatio) {
    //   canvas.style.height = window.innerHeight + 'px';
    //   canvas.style.width = window.innerHeight / canvasRatio + 'px';
    // } else {
    //   canvas.style.width = window.innerWidth + 'px';
    //   canvas.style.height = window.innerWidth * canvasRatio + 'px';
    // }

    const gl = renderer.gl as WebGL2RenderingContext;

    renderer.registerShaderFactory(SpriteShader);
    renderer.registerShaderFactory(SimpleSpriteShader);

    const batch = (this._batch = new SpriteBatch(gl));
    const stage = (this._stage = new SpriteLayer(renderer, canvas.width, canvas.height, batch));
    this._cam = stage.cam;

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    this._juggler = new Juggler();

    this.__refresh = () => this._refresh();
  }

  get renderer(): GLRenderer {
    return this._renderer;
  }
  get batch(): SpriteBatch {
    return this._batch;
  }
  get stage(): SpriteLayer {
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

  start(): void {
    this._t0 = this._t = new Date().getTime();
    this._active = true;
    this._juggler.start();
    this._refresh();
  }

  stop(): void {
    this._active = false;
    this._juggler.stop();
  }

  abstract update(time: number, elapsedTime: number): void;
  abstract beforeRender(time: number, elapsedTime: number): void;
  abstract afterRender(time: number, elapsedTime: number): void;

  protected _refresh(requestAnimationFrame = true): void {
    if (this._active === false) return;
    if (requestAnimationFrame) (self as any).requestAnimationFrame(this.__refresh);

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
    this.afterRender(timeR, elapsedTimeR);
    this._t = t1;
  }
}
