import { IDestroy } from './IDestroy';


export interface IPoolable extends IDestroy {
  reset(): void;

  released?: () => void;
  release?: () => void;
}
