import {AnyWebRenderingGLContext} from "../core/Helpers";

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
