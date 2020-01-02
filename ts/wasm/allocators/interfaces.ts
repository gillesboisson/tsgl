import { WasmClass } from '../WasmClass';
import { EmscriptenModuleExtended } from '../EmscriptenModuleLoader';

export interface WasmAllocatorI<T extends WasmClass> {
  allocate(module: EmscriptenModule, element: T): number;

  deallocate(module: EmscriptenModule, elementPtr: number): void;
}

export interface WasmIndexedAllocatorI<T extends WasmClass> extends WasmAllocatorI<T> {
  getElement(module: EmscriptenModule, elementPtr: number): T;

  getElements(module: EmscriptenModule, elementPtrs: number[] | Uint32Array, array?: T[]): T[];
}
