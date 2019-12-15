import { WasmAllocatorI } from '../allocators/interfaces';
import { WasmClass, WasmClassType } from '../WasmClass';

export type WasmStructProp<T extends WasmClass = WasmClass> = {
  methodsPrefix?: string;
  allocator?: WasmAllocatorI<T>;
  //indexElements?: boolean,
};

/*
export type WasmProp<T extends WasmClass = WasmClass> = {
  name?: string;
  offset?: number;
  length: number;
  type: any;
  isPtr?: boolean;
  wasmType?: WasmClassType<T>;
  ptrCanRelocate?: boolean;
  isBool?: boolean;
  useAccessor?: boolean;
  defined?: boolean;
};
*/
export type WasmFunctionOut = {
  name?: string;
  returnType: Emscripten.ValueType;
  argsType: Emscripten.ValueType[];
  used?: boolean;
  target?: any;
};
/*
export const defaultWasmProp: WasmProp = {
  offset: -1,
  length: 1,
  isPtr: false,
  ptrCanRelocate: true,
  isBool: false,
  type: null,
  defined: false,
};

/*
export type WasmClassProp<T extends WasmClass = WasmClass> = {
  className: string,
  allocator?: WasmAllocatorI<T>,
  //indexElements?: boolean,
}

export type WasmMethodOut = {
  name?: string;
  returnType: string,
  argsType: string[];
};
*/
