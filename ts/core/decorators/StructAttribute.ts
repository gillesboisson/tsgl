import { WasmClassType, WasmClass } from '../../wasm/WasmClass';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLAttribute } from '../../gl/core/data/GLAttribute';

export type StructAttributeProp = {
  name?: string;
  isBool?: boolean;
  offset?: number;
  length: number;
  type: any;
  wasm?: WasmAttributeProp;
  gl?: GLAttributeProp;
  useAccessor?: boolean;
  defined?: boolean;
};

export type WasmAttributeProp = {
  isPtr?: boolean;
  wasmType?: WasmClassType<WasmClass>;
  ptrCanRelocate?: boolean;
};

export type GLAttributeProp = {
  name?: string;
  location?: number;
  type?: (gl: AnyWebRenderingGLContext) => GLenum;
  normalize?: boolean;
};

export type StructAttributes = StructAttributeProp[];

export const defaultStructAttributeProp: StructAttributeProp = {
  offset: -1,
  length: 1,
  isBool: false,
  type: null,
  defined: false,
};

export const defaultWasmAttributeProp: WasmAttributeProp = {
  isPtr: false,
  ptrCanRelocate: true,
};

export const defaultGLAttributeProp: GLAttributeProp = {
  normalize: false,
  type: (gl: AnyWebRenderingGLContext) => gl.FLOAT,
};

function createOrAddPropList(
  name: string,
  prop: StructAttributeProp,
  glProp: GLAttributeProp,
  wasmProp: WasmAttributeProp,
  target: any,
) {
  const finalProp: StructAttributeProp = {
    ...defaultStructAttributeProp,
    name,
    ...prop,

    useAccessor: prop.useAccessor === true || prop.length === 1,
  };

  if (glProp !== undefined) {
    finalProp.gl = {
      ...defaultGLAttributeProp,
      name: name,
      ...glProp,
    };
  }

  if (wasmProp !== undefined) {
    finalProp.wasm = {
      ...defaultWasmAttributeProp,
      ...wasmProp,
    };
  }

  if (!target.__anPropsList) {
    target.__anPropsList = [finalProp];
  } else {
    target.__anPropsList.push(finalProp);
  }
}

export function structAttr(prop: StructAttributeProp) {
  return function(target: any, propName: string | Symbol) {
    createOrAddPropList(<string>propName, prop, prop.gl, prop.wasm, target);
  };
}

export function wasmPtrAttr(prop?: StructAttributeProp) {
  return function(target: any, propName: string | Symbol) {
    createOrAddPropList(
      <string>propName,
      { ...prop, useAccessor: true, type: Uint32Array, length: 1 },
      prop.gl,
      { ...prop.wasm, isPtr: true },
      target,
    );
  };
}

export function wasmObjectAttr<T extends WasmClass>(wasmType: WasmClassType<T>, prop?: StructAttributeProp) {
  return function(target: any, propName: string | Symbol) {
    createOrAddPropList(
      <string>propName,
      { ...prop, useAccessor: true, length: 1 },
      prop.gl,
      { ...prop.wasm, wasmType },
      target,
    );
  };
}

export function structBool(prop?: StructAttributeProp) {
  return function(target: any, propName: string | Symbol) {
    createOrAddPropList(
      <string>propName,
      { ...prop, useAccessor: true, type: Uint32Array, length: 1 },
      prop.gl,
      prop.wasm,
      target,
    );
  };
}
