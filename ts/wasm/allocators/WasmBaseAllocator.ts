import { WasmClass, WasmClassType } from "../WasmClass";
import {WasmAllocatorI, WasmIndexedAllocatorI} from "./interfaces";
import {WasmDynamicAllocatorOptions} from "./WasmDynamicAllocator";



export class WasmBaseAllocator<T extends WasmClass>
  implements WasmAllocatorI<T> {


  constructor(protected wasmType: WasmClassType<T>){

  }

  allocate(module: EmscriptenModule, element: T): number {
    return module._malloc(this.wasmType.byteLength);
  }

  deallocate(module: EmscriptenModule, elementPtr: number): void {
    module._free(elementPtr);
  }

}
