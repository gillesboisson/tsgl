import { IDestroy } from '@tsgl/core';


export interface IPoolable extends IDestroy {
  reset(): void;

  released?: () => void;
  release?: () => void;
}
