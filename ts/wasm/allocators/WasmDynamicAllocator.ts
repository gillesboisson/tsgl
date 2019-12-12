import { WasmClass, WasmClassType } from "../WasmClass";
import {WasmIndexedAllocatorI} from "./interfaces";

export type WasmDynamicAllocatorOptions<T extends WasmClass> = {
  wasmType: WasmClassType<T>,
  createIfNotFound?: boolean
}

export class WasmDynamicAllocator<T extends WasmClass>
  implements WasmIndexedAllocatorI<T> {
  private ptrs: number[] = [];
  private elements: T[] = [];
  protected wasmType: WasmClassType<T>;
  protected createIfNotFound: boolean = true;

  constructor(
    options: WasmDynamicAllocatorOptions<T>,
  ) {
    if(options.createIfNotFound) this.createIfNotFound = options.createIfNotFound;
    if(options.wasmType) this.wasmType = options.wasmType;
  }

  allocate(module: EmscriptenModule, element: T) : number {
    const ptr = module._malloc(this.wasmType.byteLength);
    this.ptrs.push(ptr);
    this.elements.push(element);
    return ptr;
  }

  deallocate(module: EmscriptenModule, elementPtr: number) {
    const ind = this.ptrs.indexOf(elementPtr);
    if (ind !== -1) {
      this.ptrs.splice(ind, 1);
      this.elements.splice(ind, 1);
    }
    module._free(elementPtr);
  }

  getElement(module: EmscriptenModule, elementPtr: number): T {
    const ind = this.ptrs.indexOf(elementPtr);
    if (ind !== -1) {
      return this.elements[ind];
    } else if (this.createIfNotFound) {
      const element = new this.wasmType(module, elementPtr);
      this.ptrs.push(elementPtr);
      this.elements.push(element);
      return element;
    } else
      throw new Error(
        "dynamicAllocate::getElement element with " + elementPtr + " not found"
      );
  }

  getElements(
    module: EmscriptenModule,
    elementPtrs: number[],
    array: T[] = new Array(elementPtrs.length)
  ): T[] {
    for (let i = 0; i < elementPtrs.length; i++) {
      array[i] = this.getElement(module, elementPtrs[i]);
    }
    return array;
  }
}
