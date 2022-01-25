import { IDestroy } from '../tsgl/common/IDestroy';


export interface IPoolable extends IDestroy {
  reset(): void;

  released?: () => void;
  release?: () => void;
}
