import { vec2, vec3 } from 'gl-matrix';
import { Camera } from '../3d/Camera';

const __tempVec31 = vec3.create();
// const __tempVec32 = vec3.create();
// const __tempVec33 = vec3.create();

abstract class CameraController {
  private __mouseMoveHandler: (e: MouseEvent) => void;
  private __mouseWheelHandler: (e: MouseEvent) => void;
  private __mouseUpHandler: (e: MouseEvent) => void;
  private __keyUpHandler: (e: KeyboardEvent) => void;
  private __mouseDownHandler: (e: MouseEvent) => void;
  private __keyDownHandler: (e: KeyboardEvent) => void;

  protected inputState: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;

    mouse: {
      down: boolean;
      x: number;
      y: number;
    };
  } = {
    up: false,
    down: false,
    left: false,
    right: false,
    mouse: {
      down: false,
      x: 0,
      y: 0,
    },
  };

  constructor(readonly cam: Camera, readonly dom: HTMLElement, readonly translationSpeed: number) {
    this.__mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
    this.__mouseDownHandler = (e: MouseEvent) => this.onMouseDown(e);
    this.__mouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);
    this.__mouseWheelHandler = (e: WheelEvent) => this.onMouseWheel(e);

    this.__keyUpHandler = (e: KeyboardEvent) => this.onKeyUpdate(e, false);
    this.__keyDownHandler = (e: KeyboardEvent) => this.onKeyUpdate(e, true);

    dom.addEventListener('mousemove', this.__mouseMoveHandler);
    dom.addEventListener('mousedown', this.__mouseDownHandler);
    document.addEventListener('mouseup', this.__mouseUpHandler);
    document.addEventListener('wheel', this.__mouseWheelHandler);

    document.addEventListener('keydown', this.__keyDownHandler);
    document.addEventListener('keyup', this.__keyUpHandler);
  }
  onMouseWheel(e: WheelEvent) {
    console.log('e.deltaY', e.deltaY);
  }

  drag(clientX: number, clientY: number): void {
    const { x, y } = this.inputState.mouse;

    this._mouseXOffset += clientX - x;
    this._mouseYOffset += clientY - y;

    this.inputState.mouse.x = clientX;
    this.inputState.mouse.y = clientY;
  }

  protected _mouseXOffset = 0;
  protected _mouseYOffset = 0;

  abstract onKeyUpdate(e: KeyboardEvent, state: boolean): void;

  abstract update(elapsedTime: number): void;

  onMouseDown(e: MouseEvent): void {
    this.inputState.mouse.down = true;
    this.inputState.mouse.x = e.clientX;
    this.inputState.mouse.y = e.clientY;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseUp(e: MouseEvent): void {
    this.inputState.mouse.down = false;
  }
  onMouseMove(e: MouseEvent): void {
    if (this.inputState.mouse.down) {
      this.drag(e.clientX, e.clientY);
    }
  }

  destroy(): void {
    this.dom.removeEventListener('mousemove', this.__mouseMoveHandler);
    this.dom.removeEventListener('mousedown', this.__mouseDownHandler);
    document.removeEventListener('mouseup', this.__mouseUpHandler);
    document.removeEventListener('wheel', this.__mouseWheelHandler);


    document.removeEventListener('keydown', this.__keyDownHandler);
    document.removeEventListener('keyup', this.__keyUpHandler);
  }
}

export class OrthoCameraController extends CameraController {
  protected _translationV: vec3 = vec3.create();
  protected _zoomOffset = 0;

  constructor(
    cam: Camera,
    dom: HTMLElement,
    translationSpeed: number,
    readonly zoomSpeed: number,
    readonly aspectRatio: number,
    protected refCamRadius = 30,
  ) {
    super(cam, dom, translationSpeed);
    this.updateCamProjection();
  }

  protected updateCamProjection(zoomOffset = this._zoomOffset): void {
    if (zoomOffset) {
      this.refCamRadius += zoomOffset * this.zoomSpeed;
    }


    this.cam.setOrtho(
      -this.refCamRadius,
      this.refCamRadius,
      -this.refCamRadius * this.aspectRatio,
      this.refCamRadius * this.aspectRatio,
    );
  }

  onMouseWheel(e: WheelEvent): void{
    this.updateCamProjection(e.deltaY);
  }

  onKeyUpdate(e: KeyboardEvent, state: boolean): void {
    {
      switch (e.code) {
        case 'KeyQ':
          this._translationV[1] = state ? -1 : 0;
          break;
        case 'KeyE':
          this._translationV[1] = state ? 1 : 0;

          break;
        case 'KeyA':
          this._translationV[0] = state ? -1 : 0;
          break;
        case 'KeyD':
          this._translationV[0] = state ? 1 : 0;

          break;
        case 'KeyW':
          this._translationV[2] = state ? 1 : 0;
          break;
        case 'KeyS':
          this._translationV[2] = state ? -1 : 0;

          break;
      }
    }
  }
  update(elapsedTime: number): void {
    this.cam.transform.translate(
      ((this._translationV[0] * elapsedTime) / 16) * this.translationSpeed,
      ((this._translationV[2] * elapsedTime) / 16) * this.translationSpeed,
      0,
    );

    
  }
}

export class FirstPersonCameraController extends CameraController {
  private _orientationVec = vec3.create();

  constructor(cam: Camera, dom: HTMLElement, translationSpeed: number, readonly rotationSpeed: number) {
    super(cam, dom, translationSpeed);
  }

  onKeyUpdate(e: KeyboardEvent, state: boolean): void {
    {
      switch (e.code) {
        case 'KeyQ':
          this._orientationVec[1] = state ? -1 : 0;
          break;
        case 'KeyE':
          this._orientationVec[1] = state ? 1 : 0;

          break;
        case 'KeyA':
          this._orientationVec[0] = state ? -1 : 0;
          break;
        case 'KeyD':
          this._orientationVec[0] = state ? 1 : 0;

          break;
        case 'KeyW':
          this._orientationVec[2] = state ? -1 : 0;
          break;
        case 'KeyS':
          this._orientationVec[2] = state ? 1 : 0;

          break;
      }
    }
  }

  update(elapsedTime: number): void {
    if (this._orientationVec[0] !== 0 || this._orientationVec[1] !== 0 || this._orientationVec[2] !== 0) {
      vec3.transformQuat(__tempVec31, this._orientationVec, this.cam.transform.getRawRotation());
      vec3.scale(__tempVec31, __tempVec31, elapsedTime / 16);
      vec3.normalize(__tempVec31, __tempVec31);

      this.cam.transform.translate(
        __tempVec31[0] * this.translationSpeed,
        __tempVec31[1] * this.translationSpeed,
        __tempVec31[2] * this.translationSpeed,
      );
    }

    if (this._mouseXOffset !== 0 || this._mouseYOffset !== 0) {
      this.cam.transform.rotateEuler(
        this._mouseYOffset * -this.rotationSpeed,
        this._mouseXOffset * -this.rotationSpeed,
        0,
      );
      this._mouseXOffset = this._mouseYOffset = 0;
    }
  }
}
