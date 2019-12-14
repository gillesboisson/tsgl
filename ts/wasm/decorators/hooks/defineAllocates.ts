import { WasmStructProp } from '../types';
import { StructAttributeProp } from '../../../core/decorators/StructAttribute';

function cppTypeToWrap(type: string) {
  return type === 'string' ? 'string' : type === 'bool' ? 'boolean' : 'number';
}

export function defineAllocate(target: any, structProps?: WasmStructProp) {
  const prototype = target.prototype;

  let classBLength = 0;
  for (const prop of prototype.__anPropsList) {
    const propOffset = prop.offset === -1 ? classBLength : prop.offset;
    const byteLength = prop.wasmType ? prop.wasmType.byteLength : prop.type.BYTES_PER_ELEMENT * prop.length;
    const nLength = propOffset + byteLength;
    if (nLength > classBLength) classBLength = nLength;
  }

  target.byteLength = classBLength;

  target.prototype.byteLength = classBLength;

  prototype.allocate = function(arrayBuffer: ArrayBuffer, offset: number) {
    let cBLength = 0;
    let prop: StructAttributeProp;
    // console.log('prototype.__anPropsList : ', prototype.__anPropsList);

    for (prop of prototype.__anPropsList) {
      const propName = '__' + prop.name;
      const propOffset = prop.offset === -1 ? cBLength : prop.offset;
      const byteLength =
        prop.wasm !== undefined && prop.wasm.wasmType !== undefined
          ? prop.wasm.wasmType.byteLength
          : prop.type.BYTES_PER_ELEMENT * prop.length;
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

    if (structProps && prototype.__anFunctionssOutList)
      for (const method of prototype.__anFunctionssOutList) {
        this['__' + method.name] = this._module.cwrap(
          structProps.methodsPrefix + method.name,
          method.returnType,
          method.argsType,
        );
      }
  };
}
