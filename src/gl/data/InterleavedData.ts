import {AnyWebRenderingGLContext} from "../core/Helpers";
import {GLBuffer} from "../core/GLBuffer";
import {GLAttribute} from "../core/GLAttribute";

export interface InterleavedProp {
    name?: string,
    type: any,
    offset?: number,
    length?: number,
    attributeName?: string,
    attributeLocation?: number,
    attributeType?: (gl: AnyWebRenderingGLContext) => GLenum,
    attributeNormalize?: boolean,
    useAccessor?: boolean,
}


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

export interface IInterleavedData {
    allocate(
        array: InterleavedDataArray<IInterleavedData>,
        arrayBuffer: ArrayBuffer,
        offset: number,
        stride: number): void;

}

export class InterleavedDataArray<DataT extends IInterleavedData> {

    protected _arrayBuffer: ArrayBuffer;
    protected _collection: DataT[];
    protected _byteLength: number;
    protected _bufferView: Uint8Array;

    constructor(
        protected DataClass: any, protected _length: number, protected _stride: number, arrayBuffer?: ArrayBuffer) {
        this._byteLength = _length * _stride;

        if (arrayBuffer === undefined) {
            this._bufferView = new Uint8Array(this._byteLength);
            arrayBuffer = this._bufferView.buffer;
        } else {
            this._bufferView = new Uint8Array(arrayBuffer);
            if (this._byteLength > arrayBuffer.byteLength) {
                throw new Error('buffer size is out of provided array buffer range');
            }
        }

        this._arrayBuffer = arrayBuffer;
        this._collection = new Array(_length);

        for (let i = 0; i < _length; i++) {
            this.buildData(i);
        }
    }



    buildData(index: number) {

        this._collection[index] = new this.DataClass();
        this._collection[index].allocate(this, this._arrayBuffer, index * this._stride, this._stride);
    }

    get byteLength(): number {
        return this._byteLength;
    }

    get collection(): DataT[] {
        return this._collection;
    }

    get arrayBuffer(): ArrayBuffer {
        return this._arrayBuffer;
    }

    get bufferView(): ArrayBufferView {
        return this._bufferView;
    }

}
