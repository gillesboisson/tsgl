export interface Type<T> extends Function {
  new (...args: any[]): T;
}

// export interface TypedArray<T extends AnyTypedArray> extends Function {
//   new (...args: any[]): T;
//   BYTES_PER_ELEMENT: number;
// }

export type AnyTypedArray =
  | Float32Array
  | Float64Array
  | Uint16Array
  | Uint32Array
  | Uint8Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array;

export type AnyTypedArrayContructor =
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | Uint8ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | BigInt64ArrayConstructor;
