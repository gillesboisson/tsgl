import { GameInputAxesState, GameInputKey, GameInputPressState, GAME_INPUT_AXE_ALL, GAME_INPUT_KEY_ALL } from './types';

export function findKeyMapping(index: number, mapping: { [key in GameInputKey]: number | number[] }): number {
  Object.keys(mapping).forEach(function (key: GameInputKey) {
    if (mapping[key] === index) {
      return key;
    } else if (Array.isArray(mapping[key]) && (mapping[key] as number[]).indexOf(index) !== -1) {
      return key;
    }
  });

  return -1;
}

export function resetInputPressState(state: GameInputPressState = {} as any): GameInputPressState{
  for(const key of GAME_INPUT_KEY_ALL){
    state[key] = false;
  }

  return state;
}

export function resetInputAxesState(state: GameInputAxesState = {} as any): GameInputAxesState{
  return {
    stick_axis_left:state.stick_axis_left || [0,0],
    stick_axis_right:state.stick_axis_right || [0,0],
  };
}

export function gamepadAxeIsOffPosition(axes: number[], offThreshold = 0.3): boolean {
  return (!axes[0] || Math.abs(axes[0]) < offThreshold) && (!axes[1] || Math.abs(axes[1]) < offThreshold);
}