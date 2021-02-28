import { Camera } from '../tsgl/3d/Camera';
import { Juggler } from '../tsgl/animation/Juggler';
import { AnyWebRenderingGLContext } from '../tsgl/gl/core/GLHelpers';
import { GLRenderer, GLRendererType } from '../tsgl/gl/core/GLRenderer';
import { GLSupport } from '../tsgl/gl/core/GLSupport';

export abstract class Base3DApp<ContextT extends AnyWebRenderingGLContext = WebGL2RenderingContext> {
  readonly renderer: GLRenderer<ContextT>;
  readonly canvas : HTMLCanvasElement;
  protected _t0: number;
  protected _t: number;
  protected _juggler: Juggler;
  private __refresh: () => void;
  protected _active: boolean;
  protected _cam: Camera;

  constructor(readonly rendererType = GLRendererType.WebGL) {

    this.canvas = this.getCanvas();
    const renderer = this.renderer = this.createRenderer(this.canvas);
    
    const gl = renderer.gl;

    this._cam = Camera.createPerspective(70, renderer.width / renderer.height, 0.001, 100);

    this._juggler = new Juggler();

    this.__refresh = () => this._refresh();

    this.prepare(renderer, gl).then(() => this.ready(renderer, gl));
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async prepare( renderer: GLRenderer<ContextT>, gl: ContextT): Promise<void>{}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected ready( renderer: GLRenderer<ContextT>, gl: ContextT): void {

  }

  protected getCanvas(): HTMLCanvasElement{
    return document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
  }

  protected createRenderer(canvas: HTMLCanvasElement): GLRenderer<ContextT>{
    return GLRenderer.createFromCanvas(canvas, this.rendererType) as GLRenderer<ContextT>;
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected registerShader(gl: WebGL2RenderingContext, renderer: GLRenderer): void {}

 

  // get renderer(): GLRenderer {
  //   return this._renderer;
  // }

  get juggler(): Juggler {
    return this._juggler;
  }

  get active(): boolean {
    return this._active;
  }
  get cam(): Camera {
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
  // abstract beforeRender(time: number, elapsedTime: number): void;
  abstract render(time: number, elapsedTime: number): void;
  // abstract afterRender(time: number, elapsedTime: number): void;

  protected _refresh(requestAnimationFrame = true): void {
    if (this._active === false) return;
    if (requestAnimationFrame) (self as any).requestAnimationFrame(this.__refresh);

    const t1 = new Date().getTime();

    const elapsedTime = t1 - this._t;
    const time = t1 - this._t0;

    this.update(time, elapsedTime);
    this._juggler.update(elapsedTime);
    this.renderer.prepareFrame();
    this.renderer.clear();

    const elapsedTimeR = t1 - this._t;
    const timeR = t1 - this._t0;
    this.render(timeR, elapsedTimeR);
    this._t = t1;
  }
}
