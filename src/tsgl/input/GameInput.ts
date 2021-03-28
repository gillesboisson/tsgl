import EventEmitter from './EventEmitter';
import { gamepadAxeIsOffPosition, resetInputAxesState, resetInputPressState } from './functions';
import {
  GameInputAxe,
  GameInputAxeEvent,
  GameInputEventStage,
  GameInputKey,
  GameInputKeyEvent,
  GamepadAxeMapping,
  GamepadConnectEvent,
  GamepadKeyMapping,
  GAME_INPUT_AXE_ALL,
  GAME_INPUT_KEY_ALL,
  InputId,
  KeyboardKeyMapping,
} from './types';

export type EventListenner<EventT = any> = (e: EventT) => void;

abstract class GameInputController extends EventEmitter {
  keys = resetInputPressState();
  axes = resetInputAxesState();

  // keyListenners: Partial<{
  //   [key in GameInputKey]: (e: GameInputKeyEvent) => void
  // }> = {}

  constructor(readonly inputId: InputId) {
    super();
  }

  abstract destroy(): void;

  protected triggerKey(key: GameInputKey, stage: GameInputEventStage): void {
    const keyEvent: GameInputKeyEvent = {
      stage,
      key,
      inputId: this.inputId,
    };

    this.emit(stage, keyEvent);
    this.emit(`${stage}_${key}`, keyEvent);
    this.emit(key, keyEvent);
  }

  protected triggerAxe(axe: GameInputAxe, stage: GameInputEventStage, value: number[]): void {
    const axeEvent: GameInputAxeEvent = {
      stage,
      axe,
      inputId: this.inputId,
      value,
    };

    this.emit(stage, axeEvent);
    this.emit(`${stage}_${axe}`, axeEvent);
    this.emit(axe, axeEvent);
  }

  protected inputkeydown(key: GameInputKey) {
    if (!this.keys[key]) {
      this.keys[key] = true;
      this.triggerKey(key, GameInputEventStage.PRESS);
    } else {
      this.triggerKey(key, GameInputEventStage.HOLD);
    }
  }

  protected inputkeyup(key: GameInputKey) {
    if (this.keys[key]) {
      this.keys[key] = false;
      this.triggerKey(key, GameInputEventStage.RELEASE);
    }
  }

  addKeyListenner(key: GameInputKey, stage: GameInputEventStage, listenner: (e: GameInputKeyEvent) => void) {
    const eventType = stage ? `${stage}_${key}` : key;
    this.on(eventType, listenner);
  }

  removeKeyListener(key: GameInputKey, stage: GameInputEventStage, listenner: (e: GameInputKeyEvent) => void) {
    const eventType = stage ? `${stage}_${key}` : key;
    this.off(eventType, listenner);
  }
}

// export class GamepadController extends GameInputController {
//   destroy(): void {
//     throw new Error('Method not implemented.');
//   }
// }

const defaultKeyboardMapping: KeyboardKeyMapping = {
  [GameInputKey.D_PAD_LEFT]: ['ArrowLeft', 'q'],
  [GameInputKey.D_PAD_RIGHT]: ['ArrowRight', 'd'],
  [GameInputKey.D_PAD_UP]: ['ArrowUp', 'z'],
  [GameInputKey.D_PAD_DOWN]: ['ArrowDown', 's'],
  [GameInputKey.SELECT]: ['ShiftRight'],
  [GameInputKey.SHOULDER_BOTTOM_LEFT]: ['r'],
  [GameInputKey.SHOULDER_BOTTOM_RIGHT]: ['t'],
  [GameInputKey.SHOULDER_TOP_LEFT]: ['w'],
  [GameInputKey.SHOULDER_TOP_RIGHT]: ['c'],
  [GameInputKey.START]: ['Enter'],
  [GameInputKey.STICK_LEFT]: ['f'],
  [GameInputKey.STICK_RIGHT]: ['g'],
  [GameInputKey.BUTTON_1]: ['space'],
  [GameInputKey.BUTTON_2]: ['ShiftLeft'],
  [GameInputKey.BUTTON_3]: ['a'],
  [GameInputKey.BUTTON_4]: ['e'],
};

export class KeyboardController extends GameInputController {
  private _keyup: (e: KeyboardEvent) => void;
  private _keydown: (e: KeyboardEvent) => void;
  constructor(readonly mapping: KeyboardKeyMapping = { ...defaultKeyboardMapping }) {
    super(InputId.Keyboard);

    this._keyup = (e: KeyboardEvent) => this.keyup(e);
    this._keydown = (e: KeyboardEvent) => this.keydown(e);

    document.addEventListener('keydown', this._keydown);
    document.addEventListener('keyup', this._keyup);
  }
  protected keydown(e: KeyboardEvent): void {
    const mapping = this.mapping;
    for (const key of GAME_INPUT_KEY_ALL) {
      const map = mapping[key];
      if (map.indexOf(e.code) !== -1) {
        this.inputkeydown(key);
      }
    }

    // throw new Error('Method not implemented.');
  }
  protected keyup(e: KeyboardEvent): void {
    const mapping = this.mapping;

    for (const key of GAME_INPUT_KEY_ALL) {
      const map = mapping[key];
      if (map.indexOf(e.code) !== -1) {
        this.inputkeyup(key);
      }
    }
  }

  destroy(): void {
    document.removeEventListener('keydown', this._keydown);
    document.removeEventListener('keyup', this._keyup);
  }
}

const defaultGamepadMapping: GamepadKeyMapping = {
  [GameInputKey.D_PAD_LEFT]: 14,
  [GameInputKey.D_PAD_RIGHT]: 15,
  [GameInputKey.D_PAD_UP]: 12,
  [GameInputKey.D_PAD_DOWN]: 13,
  [GameInputKey.SELECT]: 8,
  [GameInputKey.SHOULDER_BOTTOM_LEFT]: 6,
  [GameInputKey.SHOULDER_BOTTOM_RIGHT]: 7,
  [GameInputKey.SHOULDER_TOP_LEFT]: 4,
  [GameInputKey.SHOULDER_TOP_RIGHT]: 5,
  [GameInputKey.START]: 9,
  [GameInputKey.STICK_LEFT]: 10,
  [GameInputKey.STICK_RIGHT]: 11,
  [GameInputKey.BUTTON_1]: 0,
  [GameInputKey.BUTTON_2]: 1,
  [GameInputKey.BUTTON_3]: 2,
  [GameInputKey.BUTTON_4]: 3,
};

const defaultGamepadAxeMapping: GamepadAxeMapping = {
  [GameInputAxe.STICK_LEFT]: [0, 1],
  [GameInputAxe.STICK_RIGHT]: [3, 4],
};

export class GamepadController extends GameInputController {
  destroy(): void {
  }
  protected gamepad: Gamepad;

  constructor(
    inputId: InputId.Player1 | InputId.Player2 | InputId.Player3 | InputId.Player4,
    readonly mapping: { keys: GamepadKeyMapping; axes: GamepadAxeMapping } = {
      keys: { ...defaultGamepadMapping },
      axes: { ...defaultGamepadAxeMapping },
    },
  ) {
    super(inputId);
  }

  public update(): void {
    const gamepads = window.navigator.getGamepads();
    const length = 4; // length = gamepads.length;
    let i;

    
    if (gamepads && gamepads[this.inputId]) {
      if (!this.gamepad) {
        this.gamepad = gamepads[this.inputId];
        this.emit(GamepadConnectEvent.CONNECT, this.gamepad);
      }

      const gamepad =  gamepads[this.inputId];
      const keyMapping = this.mapping.keys;
      const axeMapping = this.mapping.axes;
      const keys = this.keys;

      // console.log('gamepad.',gamepad.buttons[0]);

      for (const key of GAME_INPUT_KEY_ALL) {
        const buttonCode = keyMapping[key];
        const pressed = gamepad.buttons[buttonCode]?.pressed;
        if (pressed) {
          if (keys[key]) {
            this.triggerKey(key, GameInputEventStage.HOLD);
          } else {
            keys[key] = true;
            this.triggerKey(key, GameInputEventStage.PRESS);
          }
        } else if (keys[key]) {
          keys[key] = false;
          this.triggerKey(key, GameInputEventStage.RELEASE);
        }
      }

      for (const axe of GAME_INPUT_AXE_ALL) {
        const axeValue = this.axes[axe];
        const axeWasOff = gamepadAxeIsOffPosition(axeValue);

        axeValue[0] = gamepad.axes[axeMapping.stick_axis_left[0]];
        if (axeMapping.stick_axis_left[1] !== undefined) {
          axeValue[1] = gamepad.axes[axeMapping.stick_axis_left[1]];
        }

        const axeIsOff = gamepadAxeIsOffPosition(axeValue);

        if (!axeIsOff) {
          if(axeWasOff){
            this.triggerAxe(axe, GameInputEventStage.PRESS, axeValue);
          }else{
            this.triggerAxe(axe, GameInputEventStage.HOLD, axeValue);
          }

        } else if (!axeWasOff) {
          axeValue[0] = 0;
          if (axeMapping.stick_axis_left[1] !== undefined) {
            axeValue[1] = 0;
          }

          this.triggerAxe(axe, GameInputEventStage.RELEASE, axeValue);

        }
      }

    } else if (this.gamepad) {
      delete this.gamepad;
      this.emit(GamepadConnectEvent.DISCONNECT);
    }

    // for (i = 0; i < length; i = i + 1) {
    //   if (gamepads[i]) {
    //     if (!this._events.gamepad[i]) {
    //       this._handleGamepadConnected(i);

    //       this._events.gamepad[i] = {};
    //       this._events.axes[i] = {};
    //     }

    //     this._handleGamepadEventListener(gamepads[i]);
    //     this._handleGamepadAxisEventListener(gamepads[i]);
    //   } else if (this._events.gamepad[i]) {
    //     this._handleGamepadDisconnected(i);

    //     this._events.gamepad[i] = null;
    //     this._events.axes[i] = null;
    //   }
    // }

    // this._events.gamepad.forEach((gamepad, player) => {
    //   if (gamepad) {
    //     Object.keys(gamepad).forEach((key: GameInputKey) => {
    //       this._handleEvent(key, gamepad, player);
    //     });
    //   }
    // });

    // this._events.axes.forEach((gamepad, player) => {
    //   if (gamepad) {
    //     Object.keys(gamepad).forEach((key: GameInputKey) => {
    //       this._handleEvent(key, gamepad, player);
    //     });
    //   }
    // });
  }
}
