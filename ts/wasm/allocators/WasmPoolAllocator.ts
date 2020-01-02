import { WasmClass, WasmClassType } from '../WasmClass';
import { WasmIndexedAllocatorI } from './interfaces';
import { WasmClassRelocatable } from '../WasmClassRelocatable';
import { EmscriptenModuleExtended } from '../EmscriptenModuleLoader';

export type WasmPoolAllocatorOptions<T extends WasmClass> = {
  stepSize?: number;
  wasmType: WasmClassType<T>;
};

export class WasmPoolAllocator<T extends WasmClassRelocatable> implements WasmIndexedAllocatorI<T> {
  private ptr: number = -1;
  private availablePtr: number[] = [];
  private buffer: Uint8Array;
  private length = 0;
  private bufferLength = 0;
  private elements: T[] = [];
  private wasmType: WasmClassType<T>;
  private stepSize: number = 8;

  constructor(options: WasmPoolAllocatorOptions<T>) {
    this.wasmType = options.wasmType;
    if (options.stepSize) this.stepSize = options.stepSize;
  }

  allocate(module: EmscriptenModuleExtended, element: T): number {
    if (this.ptr === -1) {
      this.bufferLength = this.wasmType.byteLength * this.stepSize;
      this.ptr = module._malloc(this.bufferLength);
      this.length++;
      this.elements.push(element);

      return this.ptr;
    } else if (this.availablePtr.length > 0) {
      const ptr = this.availablePtr.pop();
      const ind = (ptr - this.ptr) / this.wasmType.byteLength;
      this.elements[ind] = element;
      this.length++;

      return ptr;
    } else {
      this.resizeBuffer(++this.length, module);
      this.elements.push(element);

      return this.ptr + (this.length - 1) * this.wasmType.byteLength;
    }
  }

  deallocate(module: EmscriptenModuleExtended, elementPtr: number): void {
    this.elements[(elementPtr - this.ptr) / this.wasmType.byteLength] = null;
    this.availablePtr.push(elementPtr);
    this.length--;
  }

  getElement(module: EmscriptenModuleExtended, elementPtr: number): T {
    return this.elements[(elementPtr - this.ptr) / this.wasmType.byteLength];
  }

  getElements(
    module: EmscriptenModuleExtended,
    elementPtrs: number[] | Uint32Array,
    array: T[] = new Array(elementPtrs.length),
  ): T[] {
    const elementByteLength = this.wasmType.byteLength;

    for (let i = 0; i < elementPtrs.length; i++) {
      const element = this.elements[(elementPtrs[i] - this.ptr) / elementByteLength];
      if (!element) debugger;
      array[i] = element;
    }

    return array;
  }

  private resizeBuffer(newLength: number, module: EmscriptenModuleExtended) {
    const bufferLength = Math.ceil(newLength / this.stepSize) * this.stepSize;
    const elementByteLength = this.wasmType.byteLength;
    if (bufferLength !== this.bufferLength) {
      const newPtr = module._realloc(this.ptr, bufferLength * elementByteLength);
      if (newPtr !== this.ptr) {
        for (let i = 0; i < this.elements.length; i++)
          if (this.elements[i] !== null) {
            this.elements[i].relocate(newPtr + i * elementByteLength);
            this.ptr = newPtr;
          }
      }
      this.bufferLength = bufferLength;
    }
  }

  clearPool(module: EmscriptenModuleExtended) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].destroy(false);
    }

    this.length = 0;
    this.resizeBuffer(this.stepSize, module);
  }
}
