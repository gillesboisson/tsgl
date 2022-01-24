export interface BatchDataType<T> extends Function {
  new (bitOffset: number, buffer: ArrayBuffer): T;
}
