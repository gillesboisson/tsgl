import { Type } from "../core/Type";
import {WasmClass, WasmClassType} from "./WasmClass";

export function allocateMultipleWasmClasses<T extends WasmClass>(
  cl: WasmClassType<T>,
  length: number,
  module: EmscriptenModule = window["Module"]
): T[] {
  const ptr = module._malloc(length * cl.byteLength);
  const array: T[] = new Array(length);

  for (let i = 0; i < length; i++) {
    array[i] = new cl(module, ptr + i * cl.byteLength);
  }

  return array;
}

export interface TypedArrayType<T> extends Function {
  new(length: number): T;
  new(arrayOrArrayBuffer: ArrayLike<number> | ArrayBufferLike): T;
  new(buffer: ArrayBufferLike, byteOffset: number, length?: number): T
  BYTES_PER_ELEMENT: number
}



export function allocateTypedArray<T>(type: TypedArrayType<T>, length: number, module: EmscriptenModule = window["Module"]): T{
  const ptr = module._malloc(type.BYTES_PER_ELEMENT * length);
  return new type(module.HEAP8.buffer,ptr,length);
}
