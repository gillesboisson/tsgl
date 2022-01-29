import { vec3 } from 'gl-matrix';
import { Camera } from '@tsgl/common';

export const __tempVec31 = vec3.create();

export class TopDownCameraController {
  private __mouseMoveHandler: (e: MouseEvent) => void;
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

  private _orientationVec = vec3.create();

  private _mouseXOffset = 0;
  private _mouseYOffset = 0;

  constructor(
    readonly cam: Camera,
    readonly dom: HTMLElement,
    readonly translationSpeed: number,
    readonly rotationSpeed: number,
  ) {
    this.__mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
    this.__mouseDownHandler = (e: MouseEvent) => this.onMouseDown(e);
    this.__mouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);

    this.__keyUpHandler = (e: KeyboardEvent) => this.onKeyUpdate(e, false);
    this.__keyDownHandler = (e: KeyboardEvent) => this.onKeyUpdate(e, true);

    dom.addEventListener('mousemove', this.__mouseMoveHandler);
    dom.addEventListener('mousedown', this.__mouseDownHandler);
    document.addEventListener('mouseup', this.__mouseUpHandler);

    document.addEventListener('keydown', this.__keyDownHandler);
    document.addEventListener('keyup', this.__keyUpHandler);
  }

  drag(clientX: number, clientY: number): void {
    const { x, y } = this.inputState.mouse;

    this._mouseXOffset += clientX - x;
    this._mouseYOffset += clientY - y;

    this.inputState.mouse.x = clientX;
    this.inputState.mouse.y = clientY;
  }

  onKeyUpdate(e: KeyboardEvent, state: boolean): void {
    switch (e.code) {
      case 'KeyQ':
        this._orientationVec[2] = state ? 1 : 0;
        break;
      case 'KeyE':
        this._orientationVec[2] = state ? -1 : 0;

        break;
      case 'KeyA':
        this._orientationVec[0] = state ? -1 : 0;
        break;
      case 'KeyD':
        this._orientationVec[0] = state ? 1 : 0;

        break;
      case 'KeyW':
        this._orientationVec[1] = state ? 1 : 0;
        break;
      case 'KeyS':
        this._orientationVec[1] = state ? -1 : 0;

        break;
    }
  }
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

  destroy(): void {
    this.dom.addEventListener('mousemove', this.__mouseMoveHandler);
    this.dom.addEventListener('mousedown', this.__mouseDownHandler);
    document.addEventListener('mouseup', this.__mouseUpHandler);

    document.addEventListener('keydown', this.__keyDownHandler);
    document.addEventListener('keyup', this.__keyUpHandler);
  }
}
