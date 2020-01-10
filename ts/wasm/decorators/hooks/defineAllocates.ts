import { WasmStructProp } from '../types';
import { StructAttributeProp, getStructAttributesByteLength } from '../../../core/decorators/StructAttribute';

function cppTypeToWrap(type: string) {
  return type === 'string' ? 'string' : type === 'bool' ? 'boolean' : 'number';
}

export function defineAllocate(target: any, structProps?: WasmStructProp) {
  const prototype = target.prototype;

  let classBLength = getStructAttributesByteLength(prototype.__anPropsList);

  target.byteLength = classBLength;
  target.prototype.byteLength = classBLength;

  const __bindMethods = prototype.__bindMethods;

  prototype.__bindMethods = function(arrayBuffer: ArrayBuffer, offset: number) {
    if (__bindMethods !== undefined) __bindMethods.apply(this, arguments);
    if (structProps && prototype.__anFunctionssOutList)
      for (const method of prototype.__anFunctionssOutList)
        if (target.prototype === method.target) {
          this['__' + method.name] = this._module.cwrap(
            structProps.methodsPrefix + method.name,
            method.returnType,
            method.argsType,
          );
        }
  };

  prototype.allocate = function(arrayBuffer: ArrayBuffer, offset: number) {
    let cBLength = 0;
    let prop: StructAttributeProp;
    // console.log('prototype.__anPropsList : ', prototype.__anPropsList);

    for (prop of prototype.__anPropsList) {
      const propName = '__' + prop.name;
      let propOffset = prop.offset === -1 ? cBLength + prop.margin : prop.offset;
      const byteLength =
        prop.wasm !== undefined && prop.wasm.wasmType !== undefined
          ? prop.wasm.wasmType.byteLength
          : prop.type.BYTES_PER_ELEMENT * prop.length;

      if (prop.type === Uint32Array || prop.type === Float32Array || prop.type === Int32Array) {
        propOffset = Math.ceil(propOffset / 4) * 4;
      }
      if (prop.type === Uint16Array || prop.type === Int16Array) {
        propOffset = Math.ceil(propOffset / 2) * 2;
      }

      const nLength = propOffset + byteLength;

      if (nLength > cBLength) cBLength = nLength;

      if (prop.useAccessor === true) {
        if (prop.wasm !== undefined && prop.wasm.wasmType !== undefined) {
          const ptr = (this[propName + 'Ptr'] = offset + propOffset);
          this[propName] = new prop.wasm.wasmType(this._module, ptr, true);
        } else {
          this[propName] = new prop.type(arrayBuffer, offset + propOffset, prop.length);
        }
      } else {
        this[prop.name] = new prop.type(arrayBuffer, offset + propOffset, prop.length);
      }

      // create prop relocate listener
      if (prop.wasm !== undefined && prop.wasm.isPtr && prop.wasm.ptrCanRelocate === true) {
        this[propName + '_relocate'] = (ptr: number, oldPtr: any) => (this[propName][0] = ptr);
      }
    }

    this.__bindMethods(arrayBuffer, offset);
  };
}
