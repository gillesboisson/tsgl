import { IDestroy } from '../tsgl/core/IDestroy';


export interface IPoolable extends IDestroy {
  reset(): void;

  released?: () => void;
  release?: () => void;
}
