import { GameInput, GameInputEvent, GameInputEventType, GAME_INPUT_KEY_ALL } from './GameInput';

export type GameInputState = {
  button_1?: boolean;
  button_2?: boolean;
  button_3?: boolean;
  button_4?: boolean;
  shoulder_top_left?: boolean;
  shoulder_top_right?: boolean;
  shoulder_bottom_left?: boolean;
  shoulder_bottom_right?: boolean;
  select?: boolean;
  start?: boolean;
  stick_button_left?: boolean;
  stick_button_right?: boolean;
  d_pad_up?: boolean;
  d_pad_down?: boolean;
  d_pad_left?: boolean;
  d_pad_right?: boolean;
};

export function emptyInputState(): GameInputState {
  return {
    button_1: false,
    button_2: false,
    button_3: false,
    button_4: false,
    shoulder_top_left: false,
    shoulder_top_right: false,
    shoulder_bottom_left: false,
    shoulder_bottom_right: false,
    select: false,
    start: false,
    stick_button_left: false,
    stick_button_right: false,
    d_pad_up: false,
    d_pad_down: false,
    d_pad_left: false,
    d_pad_right: false,
  };
}

export default class GameInputStateManager {
  public state: GameInputState = emptyInputState();
  _input: GameInput;
  _inputPressBind: (e: GameInputEvent) => any;
  _inputReleaseBind: (e: GameInputEvent) => any;

  constructor(input: GameInput) {
    this._input = input;

    this._inputPressBind = (e) => this._inputDown(e);
    this._inputReleaseBind = (e) => this._inputUp(e);

    this._input.on(GameInputEventType.PRESS, GAME_INPUT_KEY_ALL, this._inputPressBind);
    this._input.on(GameInputEventType.RELEASE, GAME_INPUT_KEY_ALL, this._inputReleaseBind);
  }

  protected _inputDown(e: GameInputEvent) {
    if (e.player === 0 || e.player === 'keyboard') {
      this.state[e.button] = true;
      if (this.onStateUpdatedate !== undefined) this.onStateUpdatedate(this.state);
    }
  }
  protected _inputUp(e: GameInputEvent) {
    if (e.player === 0 || e.player === 'keyboard') {
      this.state[e.button] = false;
      if (this.onStateUpdatedate !== undefined) this.onStateUpdatedate(this.state);
    }
  }

  onStateUpdatedate: (state: GameInputState) => void;

  destroy() {}
}
