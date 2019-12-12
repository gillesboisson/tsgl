import {defaultWasmProp, WasmProp} from "./types";
import {WasmClass, WasmClassType} from "../WasmClass";

function createOrAddPropList(prop: WasmProp, target: any) {

  if (!target.__anPropsList) {
    target.__anPropsList = [prop];
  } else {
    target.__anPropsList.push(prop);
  }
}

export function wasmProp(prop: WasmProp) {
  return function (target: any, propName: string | Symbol) {
    prop = {
      ...defaultWasmProp,
      name: propName as string,
      ...prop,
      useAccessor: prop.useAccessor === true || prop.length === 1
    };



    createOrAddPropList(prop, target);
  };
}

export function wasmPtrProp(prop?: WasmProp) {
  return function (target: any, propName: string | Symbol) {
    prop = {
      ...defaultWasmProp,
      name: propName as string,
      ...prop,
      useAccessor: true,
      isPtr: true,
      type: Uint32Array,
      length: 1,
    };

    createOrAddPropList(prop, target);
  };
}

export function wasmObjectProp<T extends WasmClass>(wasmType: WasmClassType<T>, prop?: WasmProp) {
  return function (target: any, propName: string | Symbol) {
    prop = {
      ...defaultWasmProp,
      name: propName as string,
      ...prop,
      wasmType,
      useAccessor: true,
      length: 1,
    };
    
    createOrAddPropList(prop, target);
  };
}

export function wasmBoolProp(prop?: WasmProp) {
  return function (target: any, propName: string | Symbol) {
    prop = {
      ...defaultWasmProp,
      name: propName as string,
      ...prop,
      useAccessor: true,
      isBool: true,
      type: Uint32Array,
      length: 1,
    };

    createOrAddPropList(prop, target);
  };
}
