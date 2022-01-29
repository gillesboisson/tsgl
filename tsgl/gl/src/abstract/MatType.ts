export interface MatType<T> {
  create(): T;
  fromValues(...args: any[]): T;
}
