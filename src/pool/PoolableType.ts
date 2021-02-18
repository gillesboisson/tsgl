import { IPoolable } from './IPoolable';


export interface PoolableType<T extends IPoolable> {
  new(): T;
}
