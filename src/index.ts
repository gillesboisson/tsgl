import { GameInput } from './game/GameInput';
import GameInputStateManager from './game/GameInputStateManager';

window.addEventListener('load', async () => {
  const gameInput = GameInput.default;
  const gameInputState = new GameInputStateManager(gameInput);

  if (typeof Worker !== 'undefined') {
    const canvas = document.getElementsByTagName('canvas')[0].transferControlToOffscreen();
    const worker = new Worker('./bundle/index_worker.js');
    worker.postMessage({ subject: 'init', canvas }, [canvas] as PostMessageOptions);
    gameInputState.onStateUpdatedate = (state) => worker.postMessage({ subject: 'input', state });
  } else {
    const element = document.createElement('<script src="./bundle/index_worker.js"></script>');
    document.append(element);

    // Sorry! No Web Worker support..
  }
});
