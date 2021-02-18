import { IDestroy } from '../tsgl/base/IDestroy';


export interface IPoolable extends IDestroy {
  reset(): void;

  released?: () => void;
  release?: () => void;
}
