import { GameInputKey } from './_GameInput';



const defaultGamepadKeyMapping: {[key: GameInputKey]: number} =  {
  button_1: 0,
  button_2: 1,
  button_3: 2,
  button_4: 3,
  shoulder_top_left: 4,
  shoulder_top_right: 5,
  shoulder_bottom_left: 6,
  shoulder_bottom_right: 7,
  select: 8,
  start: 9,
  stick_button_left: 10,
  stick_button_right: 11,
  d_pad_up: 12,
  d_pad_down: 13,
  d_pad_left: 14,
  d_pad_right: 15,
  vendor: 16,
}

export class GameInputGamepad{
  constructor(
    readonly keymapping: {[key: GameInputKey]: number} = {...defaultGamepadKeyMapping}){

  }
}