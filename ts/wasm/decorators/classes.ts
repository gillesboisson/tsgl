import {WasmStructProp} from "./types";
import {defineProperties} from "./hooks/defineProperties";
import {defineAllocate} from "./hooks/defineAllocates";
import {WasmClass, WasmClassType} from "../WasmClass";
import {WasmDynamicAllocator} from "../allocators/WasmDynamicAllocator";
import {WasmBaseAllocator} from "../allocators/WasmBaseAllocator";

const structs = [];

export function wasmStruct(props?: WasmStructProp) {

  props = {
    methodsPrefix: '',
    // indexElements: false,
    ...props,
  };

  return function (target: any) {
    const prototype = target.prototype;

    prototype.__allocator = props.allocator ? props.allocator : new WasmBaseAllocator(target);

    target.allocator = prototype.__allocator;

    if (prototype.__anPropsList) {
      
      structs.push(target);
      defineProperties(prototype, props);
      defineAllocate(target, props);
    }
    return target;
  };
}

/*
export const wasmClasses: any[] = [];

export function wasmClass(props: WasmClassProp) {

  return function (target: any) {
    const prototype = target.prototype;

    prototype.__allocator = props.allocator ? props.allocator : new WasmBaseAllocator(target);
    prototype.__classProps = props;

    target.allocator = prototype.__allocator;

    if (prototype.__anPropsList) {


      if (prototype.__anMethodsOutList) for (const method of prototype.__anMethodsOutList) {
        method.argsType.splice(0, 0, props.className + '*'); // add class ptr as first args
      }

      structs.push(target);
      defineProperties(prototype, props);
      defineAllocate(target, props);
    }

    wasmClasses.push(prototype);
    return target;
  };
}
 */
