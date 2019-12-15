export type TypedArray = {
  length: number;
  buffer: ArrayBuffer;
};

export type TypedArrayType<T extends TypedArray = TypedArray> = {
  BYTES_PER_ELEMENT: number;
  new (source: ArrayLike<number>): T;
  new (buffer: ArrayBuffer, offset?: number, length?: number): T;
  new (length: number): T;
};
