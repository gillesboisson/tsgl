import { IPoolable } from './IPoolable';
import { Pool } from './Pool';


export interface PoolableType<T extends IPoolable> {
  new(pool: Pool<T>): T;
}
