import { IStartStop } from './IStartStop';


export interface IStartStopPause extends IStartStop {
  pause(): void;
}
