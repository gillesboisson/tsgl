import {WasmFunctionOut} from "./types";

export function wasmFunctionOut(name?: string, argsType: Emscripten.ValueType[] = [], returnType: Emscripten.ValueType = null) {
  return function (target: any, propName: string | Symbol) {
    argsType.splice(0, 0, 'number');
    if (!name) name = propName as string;
    // const argsType = ["number",...methodOut.argsType];


    const mProp: WasmFunctionOut = {
      name,
      argsType,
      returnType,
      used: false,
      target,
    };
    
    if (!target.__anFunctionssOutList) {
      target.__anFunctionssOutList = [mProp];
    } else {
      target.__anFunctionssOutList.push(mProp);
    }

    const methodName = "__" + name;

    target[propName as string] = function () {
      const args = Array.from(arguments);
      args.splice(0, 0, this._ptr);
      return this[methodName].apply(this,args);
    };
  };
}