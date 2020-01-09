import { WasmClass, WasmClassType } from '../WasmClass';
import { WasmAllocatorI, WasmIndexedAllocatorI } from './interfaces';
import { WasmDynamicAllocatorOptions } from './WasmDynamicAllocator';

export class WasmBaseAllocator<T extends WasmClass> implements WasmAllocatorI<T> {
  constructor(protected wasmType: WasmClassType<T>) {}

  allocate(module: EmscriptenModule, element: T): number {
    const ptr = module._malloc(this.wasmType.byteLength);
    if (!ptr) throw new Error('Allocation failed');
    return ptr;
  }

  deallocate(module: EmscriptenModule, elementPtr: number): void {
    module._free(elementPtr);
  }
}
