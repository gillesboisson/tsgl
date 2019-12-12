import {WasmClass} from "../../WasmClass";
import {WasmProp, WasmStructProp} from "../types";

export function defineProperties(prototype: any, props: WasmStructProp) {
  let prop: WasmProp;
  for (prop of prototype.__anPropsList) if (prop.defined === false) {
    prop.defined = true;
    if (prop.useAccessor) {
      prototype["__" + prop.name] = prototype[prop.name];
      const propName = "__" + prop.name;
      let get, set;
      if (prop.isPtr) {

        const propNameL = "_" + prop.name;


        get = function () {
          return this[propNameL];
        };


        if (prop.ptrCanRelocate) {
          set = function (val: WasmClass) {
            if (val !== this[propNameL]) {
              if (this[propNameL] !== undefined && this[propNameL] !== null) {
                this[propNameL].removeRelocateListener(this[propName + '_relocate']);
              }
              this[propNameL] = val;
              this[propName][0] = val ? val.ptr : null;
              if (this[propNameL] !== undefined && this[propNameL] !== null) {
                if (this[propNameL]) this[propNameL].addRelocateListener(this[propName + '_relocate']);
              }
            }
          }
        } else {
          set = function (val: WasmClass) {
            if (val !== this[propNameL]) {
              this[propNameL] = val;
              this[propName][0] = val ? val.ptr : null;
            }
          };
        }


      }if(prop.wasmType !== undefined) {
        const propName = "__" + prop.name;
        const propNamePtr = "__" + prop.name+'Ptr';

        get = function () {
          return this[propName];
        };

        set = function (val: any){
          if(val && val !== this[propName]){            //const newVal = new prop.wasmType(this._module,this[propNamePtr]);
            val.copy(this[propName]);
          }
        }

      }else if (prop.isBool) {
        const propNameL = "_" + prop.name;

        get = function () {
          return this[propName][0] === 1;
        };

        set = function (val: WasmClass) {

          this[propName][0] = val ? 1 : 0;
        };
      } else {
        get =
          prop.length > 1
            ? function () {
              return this[propName];
            }
            : function () {
              return this[propName][0];
            };

        set =
          prop.length > 1
            ? function (val: ArrayBufferView) {
              this[propName].set(val);
            }
            : function (val: number) {
              this[propName][0] = val;
            };


      }


      Object.defineProperty(prototype, prop.name, {get, set});
    }
  }
  prototype.__destroy = function () {
    for (prop of prototype.__anPropsList) if (prop.defined === false) {
      delete this["__" + prop.name];
      delete this[prop.name];
    }
  }
}
