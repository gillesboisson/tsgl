/* eslint-disable @typescript-eslint/ban-types */
let _requestAnimationFrame: Function;
let _cancelAnimationFrame: Function;
let hasGamepadSupport = false;

if (self.document !== undefined) {
  hasGamepadSupport = window.navigator.getGamepads !== undefined;

  if (String(typeof window) !== 'undefined') {
    ['webkit', 'moz'].forEach(function (key) {
      _requestAnimationFrame =
        _requestAnimationFrame ||
        window.requestAnimationFrame ||
        (window as any)[key + 'RequestAnimationFrame'] ||
        null;
      _cancelAnimationFrame =
        _cancelAnimationFrame || window.cancelAnimationFrame || (window as any)[key + 'CancelAnimationFrame'] || null;
    });
  }
}


// export enum GameInputKey {
//   BUTTON_1 = 'button_1',
//   BUTTON_2 = 'button_2',
//   BUTTON_3 = 'button_3',
//   BUTTON_4 = 'button_4',
//   SHOULDER_TOP_LEFT = 'shoulder_top_left',
//   SHOULDER_TOP_RIGHT = 'shoulder_top_right',
//   SHOULDER_BOTTOM_LEFT = 'shoulder_bottom_left',
//   SHOULDER_BOTTOM_RIGHT = 'shoulder_bottom_right',
//   SELECT = 'select',
//   START = 'start',
//   STICK_LEFT = 'stick_button_left',
//   STICK_RIGHT = 'stick_button_right',
//   D_PAD_UP = 'd_pad_up',
//   D_PAD_DOWN = 'd_pad_down',
//   D_PAD_LEFT = 'd_pad_left',
//   D_PAD_RIGHT = 'd_pad_right',
// }


// export enum GameInputAxe {
//   STICK_LEFT = 'stick_axis_left',
//   STICK_RIGHT = 'stick_axis_right',


// }



// export const GAME_INPUT_KEY_ALL_STICKS: GameInputKey[] = [GameInputKey.STICK_LEFT, GameInputKey.STICK_RIGHT];



export type GameInputPlayer = string | number; // number for gamepad number for other inputs

// type GameInputEvents = { gamepad: any[]; axes: any[]; keyboard: {} };
// type GameInputHandlers = { gamepad: { connect: any; disconnect: any } };




// type GameInputKeyMapping = {
//   gamepad: GameInputKeyMap;
//   keyboard: GameInputKeyMap;
//   axes: {
//     [key in GameInputAxe]: number | number[];
//   };
// };


// export interface GameInputEvent {
//   stage: GameInputEventStage;
//   button?: GameInputKey ;
//   axe?: GameInputAxe ;
//   value: number | number[];
//   player: GameInputPlayer;
//   event: GameInputListenner;
//   timestamp: number;
// }

// interface GameInputListenner {
//   type: string;
//   button: GameInputKey;
//   callback: (e: GameInputEvent) => void;
//   options?: any;
// }

// interface KeyState {
//   pressed: boolean;
//   released: boolean;
//   hold: boolean;
//   // value: number;
// }


// type InputKeysState = {
//   [key in GameInputKey]: boolean
// }

// export function resetInputKeysState(state: InputKeysState = {} as any): InputKeysState{
//   for(const key of GAME_INPUT_KEY_ALL){
//     state[key] = false;
//   }

//   return state;
// }


// type GameInputStateEvent = {
//   [key: number]: KeyState;
// };

// export type GameInputEvent = {
//   type: GameInputEventType;
//   button: GameInputKey ;
//   value: number | number[];
//   player: GameInputPlayer;
//   event: GameInputListenner;
//   timestamp: number;
// };


// export class GameInputController {
//   button_1 = false;
//   button_2 = false;
//   button_3 = false;
//   button_4 = false;
//   shoulder_top_left = false;
//   shoulder_top_right = false;
//   shoulder_bottom_left = false;
//   shoulder_bottom_right = false;
//   select = false;
//   start = false;
//   stick_button_left = false;
//   stick_button_right = false;
//   d_pad_up = false;
//   d_pad_down = false;
//   d_pad_left = false;
//   d_pad_right = false;

//   stick_axis_left: {
//     x: number;
//     y: number;
//   } = { x: 0, y: 0 };
//   stick_axis_right: {
//     x: number;
//     y: number;
//   } = { x: 0, y: 0 };
//   private _keyPress: (e: GameInputEvent) => void;
//   private _keyRelease: (e: GameInputEvent) => void;
//   private _keyHold: (e: GameInputEvent) => void;
//   // axes_shoulder_left = 0;
//   // axes_shoulder_right = 0;
//   constructor(readonly player: string | number, readonly gameInput: GameInput = GameInput.default){
//     this._keyPress = (e:GameInputEvent): void => {
//       if(e.player === player){
//         (this as any)[e.button] = true;
//       }
//     };

//     this._keyRelease = (e:GameInputEvent): void => {
//       if(e.player === player){
//         (this as any)[e.button] = false;
//       }
//     };


//     this._keyHold = (e:GameInputEvent): void => {
//       if(e.player === player && typeof(e.value) === 'object'){
//         (this as any)[e.button].x = (e.value as any)[0];
//         (this as any)[e.button].y = (e.value as any)[1];
//       }
      
//     };



//     gameInput.on(GameInputEventType.PRESS,null,this._keyPress);
//     gameInput.on(GameInputEventType.RELEASE,null,this._keyRelease);
//     gameInput.on(GameInputEventType.HOLD,null,this._keyHold);


//   }

//   destroy(): void{
//     this.gameInput.off(GameInputEventType.PRESS,null,this._keyPress);
//     this.gameInput.off(GameInputEventType.RELEASE,null,this._keyRelease);
//     this.gameInput.off(GameInputEventType.HOLD,null,this._keyHold);

//   }

//   reset(): void {
//     // buttons
//     this.button_1 = false;
//     this.button_2 = false;
//     this.button_3 = false;
//     this.button_4 = false;
//     this.shoulder_top_left = false;
//     this.shoulder_top_right = false;
//     this.shoulder_bottom_left = false;
//     this.shoulder_bottom_right = false;
//     this.select = false;
//     this.start = false;
//     this.stick_button_left = false;
//     this.stick_button_right = false;
//     this.d_pad_up = false;
//     this.d_pad_down = false;
//     this.d_pad_left = false;
//     this.d_pad_right = false;

//     // stick
//     this.stick_axis_left.x = 0;
//     this.stick_axis_left.y = 0;
//     this.stick_axis_right.x = 0;
//     this.stick_axis_right.y = 0;

//     // triggers
//     // this.axes_shoulder_left = 0;
//     // this.axes_shoulder_right = 0;
//   }



// }


export class GameInput {


  keys = resetInputKeysState();
  
  protected _handlers: { gamepad: { connect: any; disconnect: any } };
  
  constructor(readonly inputId: InputId){

  }
  // protected _keyMapping: GameInputKeyMapping;
  // protected _listeners: GameInputListenner[];

  // protected _requestAnimation: Function;

  // _threshold: number;

  // protected static _default: GameInput;

  // static get default(): GameInput {
  //   if (this._default === undefined) this._default = new GameInput();

  //   return this._default;
  // }

  // constructor() {
  //   this._events = {
  //     gamepad: [],
  //     axes: [],
  //     keyboard: {},
  //   };

  //   this._handlers = {
  //     gamepad: {
  //       connect: null,
  //       disconnect: null,
  //     },
  //   };

  //   this._keyMapping = {
  //     gamepad: {
  //       button_1: 0,
  //       button_2: 1,
  //       button_3: 2,
  //       button_4: 3,
  //       shoulder_top_left: 4,
  //       shoulder_top_right: 5,
  //       shoulder_bottom_left: 6,
  //       shoulder_bottom_right: 7,
  //       select: 8,
  //       start: 9,
  //       stick_button_left: 10,
  //       stick_button_right: 11,
  //       d_pad_up: 12,
  //       d_pad_down: 13,
  //       d_pad_left: 14,
  //       d_pad_right: 15,
  //       vendor: 16,
  //     },
  //     axes: {
  //       stick_axis_left: [0, 2],
  //       stick_axis_right: [2, 4],
  //     },
  //     keyboard: {
  //       button_1: 32,

  //       start: 27,
  //       d_pad_up: [38, 87],
  //       d_pad_down: [40, 83],
  //       d_pad_left: [37, 65],
  //       d_pad_right: [39, 68],
  //     },
  //   };

  //   this._threshold = 0.3;

  //   this._listeners = [];

  //   this._handleKeyboardEventListener = this._handleKeyboardEventListener.bind(this);

  //   this.resume();
  // }


  // protected _handleGamepadConnected(index: number): void {
  //   if (this._handlers.gamepad.connect) {
  //     this._handlers.gamepad.connect({ index: index });
  //   }
  // }

  // protected _handleGamepadDisconnected(index: number): void {
  //   if (this._handlers.gamepad.disconnect) {
  //     this._handlers.gamepad.disconnect({ index: index });
  //   }
  // }

  // protected _handleGamepadEventListener(controller: Gamepad): void {
  //   if (controller && controller.connected) {
  //     controller.buttons.forEach((button: any, index: any) => {
  //       const keys = findKeyMapping(index, this._keyMapping.gamepad);
  //       if (keys) {
  //         for(const key of keys) {
  //           if (button.pressed) {
  //             if (!this._events.gamepad[controller.index][key]) {
  //               this._events.gamepad[controller.index][key] = {
  //                 pressed: true,
  //                 hold: false,
  //                 released: false,
  //                 player: controller.index,
  //               };
  //             }

  //             this._events.gamepad[controller.index][key].value = button.value;
  //           } else if (!button.pressed && this._events.gamepad[controller.index][key]) {
  //             this._events.gamepad[controller.index][key].released = true;
  //             this._events.gamepad[controller.index][key].hold = false;
  //           }
  //         };
  //       }
  //     });
  //   }
  // }

  // protected _handleGamepadAxisEventListener(controller: Gamepad): void {
  //   // const self = this;

  //   if (controller && controller.connected) {
  //     Object.keys(this._keyMapping.axes).forEach((key) => {
  //       const axes = Array.prototype.slice.apply(controller.axes, (this._keyMapping.axes as any)[key]);

  //       if (Math.abs(axes[0]) > this._threshold || Math.abs(axes[1]) > this._threshold) {
  //         this._events.axes[controller.index][key] = {
  //           pressed: this._events.axes[controller.index][key] ? false : true,
  //           hold: this._events.axes[controller.index][key] ? true : false,
  //           released: false,
  //           value: axes,
  //         };
  //       } else if (this._events.axes[controller.index][key]) {
  //         this._events.axes[controller.index][key] = {
  //           pressed: false,
  //           hold: false,
  //           released: true,
  //           value: axes,
  //         };
  //       }
  //     });
  //   }
  // }

  // protected _handleKeyboardEventListener(e: KeyboardEvent): void {
  //   const keys = findKeyMapping(e.keyCode, this._keyMapping.keyboard);

  //   if (keys) {
  //     keys.forEach((key) => {
  //       if (e.type === 'keydown' && !(this._events.keyboard as any)[key]) {
  //         (this._events.keyboard as any)[key] = {
  //           pressed: true,
  //           hold: false,
  //           released: false,
  //         };
  //       } else if (e.type === 'keyup' && (this._events.keyboard as any)[key]) {
  //         (this._events.keyboard as any)[key].released = true;
  //         (this._events.keyboard as any)[key].hold = false;
  //       }
  //     });
  //   }
  // }

  // protected _handleEvent(key: GameInputKey, events: GameInputStateEvent, player: GameInputPlayer): void {
    
  //   if (events[key as any].pressed) {
  //     this.trigger(GameInputEventType.PRESS, key, events[key as any].value, player);

  //     events[key as any].pressed = false;
  //     events[key as any].hold = true;
  //   } else if (events[key as any].hold) {
  //     this.trigger(GameInputEventType.HOLD, key, events[key as any].value, player);
  //   } else if (events[key as any].released) {
  //     this.trigger(GameInputEventType.RELEASE, key, events[key as any].value, player);

  //     delete events[key as any];
  //   }
  // }

  // protected _loop(): void {
  //   const gamepads = hasGamepadSupport ? window.navigator.getGamepads() : false,
  //     length = 4; // length = gamepads.length;
  //   let i;

  //   if (gamepads) {
  //     for (i = 0; i < length; i = i + 1) {
  //       if (gamepads[i]) {
  //         if (!this._events.gamepad[i]) {
  //           this._handleGamepadConnected(i);

  //           this._events.gamepad[i] = {};
  //           this._events.axes[i] = {};
  //         }

  //         this._handleGamepadEventListener(gamepads[i]);
  //         this._handleGamepadAxisEventListener(gamepads[i]);
  //       } else if (this._events.gamepad[i]) {
  //         this._handleGamepadDisconnected(i);

  //         this._events.gamepad[i] = null;
  //         this._events.axes[i] = null;
  //       }
  //     }

  //     this._events.gamepad.forEach((gamepad, player) => {
  //       if (gamepad) {
  //         Object.keys(gamepad).forEach((key: GameInputKey) => {
  //           this._handleEvent(key, gamepad, player);
  //         });
  //       }
  //     });

  //     this._events.axes.forEach((gamepad, player) => {
  //       if (gamepad) {
  //         Object.keys(gamepad).forEach((key: GameInputKey) => {
  //           this._handleEvent(key, gamepad, player);
  //         });
  //       }
  //     });
  //   }

  //   Object.keys(this._events.keyboard).forEach((key: GameInputKey) => {
  //     this._handleEvent(key, this._events.keyboard, 'keyboard');
  //   });

  //   if (this._requestAnimation) {
  //     this._requestAnimation = _requestAnimationFrame(this._loop.bind(this));
  //   }
  // }
  // on(
  //   type: string | string[] | GameInputKey,
  //   button: GameInputKey | GameInputKey[],
  //   callback: (e: GameInputEvent) => void,
  //   options?: Object,
  // ): void {
  //   if (Object.keys(this._handlers.gamepad).indexOf(type as GameInputKey) !== -1 && typeof button === 'function') {
  //     (this._handlers.gamepad as any)[type as string] = button;

  //     this._events.gamepad = [];
  //   } else {
  //     if (typeof type === 'string' && type.match(/\s+/)) {
  //       type = type.split(/\s+/g);
  //     }

  //     if (typeof button === 'string' && button.match(/\s+/)) {
  //       button = button.split(/\s+/g) as GameInputKey[];
  //     }

  //     if (Array.isArray(type)) {
  //       type.forEach((type) => {
  //         this.on(type, button, callback, options);
  //       });
  //     } else if (Array.isArray(button)) {
  //       button.forEach((button) => {
  //         this.on(type, button, callback, options);
  //       });
  //     } else {
  //       this._listeners.push({
  //         type: type,
  //         button: button as GameInputKey,
  //         callback: callback,
  //         options: options,
  //       });
  //     }
  //   }
  // }


  // off(type: string | string[], button: GameInputKey | GameInputKey[], callback: (e: GameInputEvent) => void): void {
  //   if (typeof type === 'string' && type.match(/\s+/)) {
  //     type = type.split(/\s+/g);
  //   }

  //   if (typeof button === 'string' && button.match(/\s+/)) {
  //     button = button.split(/\s+/g) as GameInputKey[];
  //   }

  //   if (Array.isArray(type)) {
  //     type.forEach((type) => {
  //       this.off(type, button, callback);
  //     });
  //   } else if (Array.isArray(button)) {
  //     button.forEach(function (button) {
  //       this.off(type, button, callback);
  //     });
  //   } else {
  //     this._listeners = this._listeners.filter(function (listener) {
  //       return listener.type !== type && listener.button !== button && listener.callback === callback;
  //     });
  //   }
  // }

  // setCustomMapping(device: string, config: GameInputKeys): void {
  //   if ((this._keyMapping as any)[device] !== undefined) {
  //     (this._keyMapping as any) = config;
  //   } else {
  //     throw new Error('The device "' + device + '" is not supported through gamepad.js');
  //   }
  // }

  // setGlobalThreshold(num: string): void {
  //   this._threshold = parseFloat(num);
  // }

  // trigger(type: GameInputEventType, button: GameInputKey, value: number, player: GameInputPlayer): void {
  //   if (this._listeners) {
  //     this._listeners.forEach(function (listener: GameInputListenner) {
        
  //       if (listener.type === type && (listener.button === null || listener.button === button)) {
  //         listener.callback({
  //           type: listener.type,
  //           button,
  //           value: value,
  //           player: player,
  //           event: listener,
  //           timestamp: Date.now(),
  //         });
  //       }
  //     });
  //   }
  // }

  // pause(): void {
  //   _cancelAnimationFrame(this._requestAnimation);

  //   this._requestAnimation = null;

  //   document.removeEventListener('keydown', this._handleKeyboardEventListener);
  //   document.removeEventListener('keyup', this._handleKeyboardEventListener);
  // }

  // resume(): void {
  //   this._requestAnimation = _requestAnimationFrame(this._loop.bind(this));

  //   document.addEventListener('keydown', this._handleKeyboardEventListener);
  //   document.addEventListener('keyup', this._handleKeyboardEventListener);
  // }

  // destroy(): void {
  //   this.pause();

  //   delete this._listeners;
  // }
}
