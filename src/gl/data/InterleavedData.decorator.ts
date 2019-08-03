import {AnyWebRenderingGLContext} from "../core/Helpers";
import {IInterleavedData, InterleavedDataArray, InterleavedProp} from "./InterleavedData";

export function interleavedProp(prop: InterleavedProp) {
    return function (target: any, propName: string | Symbol) {

        prop = {
            name: propName as string,
            length: 1,
            offset: -1,
            attributeNormalize: false,
            attributeType: (gl: AnyWebRenderingGLContext) => gl.FLOAT,
            ...prop,
            useAccessor: prop.useAccessor === true || prop.length === 1
        };

        if (!target.__anPropsList) {
            target.__anPropsList = [prop];
        } else {
            target.__anPropsList.push(prop);
        }
    }
}

export function interleavedData() {
    return function (target: any) {
        const prototype = target.prototype;

        if (prototype.__anPropsList) {
            const allocate = prototype.allocate;

            for (let prop of prototype.__anPropsList) {

                if(prop.useAccessor) {

                    prototype['__' + prop.name] = prototype[prop.name];
                    const propName = '__'+ prop.name;

                    const get = prop.length > 1
                        ? function () {
                            return this[propName]
                        }
                        : function () {
                            return this[propName][0]
                        };

                    const set = prop.length > 1
                        ? function (val: ArrayBufferView) {
                            this[propName].set(val);
                        }
                        : function (val: number) {
                            this[propName][0] = val;
                        };

                    Object.defineProperty(prototype, prop.name, {get, set});
                }
            }

            prototype.allocate = function (
                array: InterleavedDataArray<IInterleavedData>,
                arrayBuffer: ArrayBuffer,
                offset: number,
                stride: number) {

                let length = 0;

                for (let prop of prototype.__anPropsList) {
                    const propOffset = prop.offset === -1 ? length : prop.offset;
                    const nLength = propOffset + prop.type.BYTES_PER_ELEMENT * prop.length;
                    if(nLength > length) length = nLength;
                    if(prop.useAccessor === true){
                        this['__'+prop.name] = new prop.type(arrayBuffer, offset + propOffset, prop.length);
                    }else{
                        this[prop.name] = new prop.type(arrayBuffer, offset + propOffset, prop.length);
                    }
                }

                if (allocate) allocate.apply(this, arguments);
            }
        }
    }
}
