export interface IStruct {
  byteLength: number;
}

export interface StructType<T> extends Function {
  new (...args: any[]): T;
  byteLength: number;
}
