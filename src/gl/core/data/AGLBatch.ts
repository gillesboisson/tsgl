import {IInterleavedData, InterleavedDataArray} from "../../data/InterleavedData";
import {GLVao} from "./GLVao";
import {AnyWebRenderingGLContext} from "../Helpers";
import {GLBuffer} from "./GLBuffer";
import {GLAttribute} from "./GLAttribute";

export type pullMethod<DataT extends IInterleavedData> = (
    points: DataT[],
    pointInd: number,
    indices?: Uint16Array,
    indiceInd?: number,
    indiceStride?: number,
) => void;

export interface GLBatchable<DataT extends IInterleavedData> {
    pullFromBatch: pullMethod<DataT>;
    pointLength: number;
    indexLength: number;
}

export abstract class AGLBatch<DataT extends IInterleavedData> extends InterleavedDataArray<DataT>{
    protected _vao: GLVao;
    protected _buffer: GLBuffer;
    protected _indexBuffer: GLBuffer;
    protected _indexArray: Uint16Array;

    protected _attributes: GLAttribute[];

    protected _pointPos     = 0;
    protected _indexPos    = 0;
    protected _pointInc     = 0;
    protected _indiceInc    = 0;

    constructor(
        protected _gl: AnyWebRenderingGLContext,
        DataClass: any,
        pointLength: number,
        stride: number,
        protected _indexLength: number = -1,
        protected _indexStride: number = -1,
        drawType: GLenum = _gl.DYNAMIC_DRAW,
    ){
        super(DataClass,pointLength,stride);
        this._buffer = new GLBuffer(_gl, _gl.ARRAY_BUFFER, drawType, this._bufferView);

        if(!DataClass.createAttributes){
            throw new Error('Class must implement static method createAttributes(gl: WebGLContext, buffer: GLBuffer, stride: number) : GLAttribute[]');
        }

        if(_indexLength !== -1){
            this._indexArray = new Uint16Array(_indexLength * _indexStride);
            this._indexBuffer = new GLBuffer(_gl, _gl.ELEMENT_ARRAY_BUFFER, drawType, this._indexArray);
        }

        this._attributes = DataClass.createAttributes(_gl, this._buffer, this._stride) as GLAttribute[];
        this._vao = new GLVao(_gl, this._attributes, this._indexBuffer);
    }

    protected bufferData(){
        this._buffer.bufferSubData(this._bufferView, this._stride * this._pointPos);
        if(this._indexLength !== -1) this._indexBuffer.bufferSubData(this._indexArray, this._indexPos);
    }

    public reset(){
        this._pointPos      = 0;
        this._indexPos     = 0;
    }

    public begin(){
        this.reset();

    }

    public push(pointLength: number, indexLength: number, pull: pullMethod<DataT>){
        if(this._pointPos + pointLength > this._length || this._indexPos + indexLength > this._indexLength) {
            this.complete();
        }

        if(this._indexLength !== -1){
            pull(this._collection, this._pointPos, this._indexArray, this._indexPos, this._indexStride);

        }else{
            pull(this._collection, this._pointPos);
        }

        this._pointPos += pointLength;
        this._indexPos += indexLength;
    }

    public pushElement(element: GLBatchable<DataT>){
        if(this._pointPos + element.pointLength > this._length || this._indexPos + element.indexLength > this._indexLength) {
            this.complete();
        }

        element.pullFromBatch(
            this._collection,
            this._pointPos,
            this._indexArray,
            this._indexPos * this._indexStride,
            this._indexStride
        );

        this._pointPos += element.pointLength;
        this._indexPos += element.indexLength;
    }

    public complete(){
        this.bufferData();
        this._vao.bind();
        this.ended(this._gl, this._pointPos, this._indexPos * this._indexStride);
        this._vao.unbind();
        this.reset();

    }

    public end(){
        this.complete();
    }

    abstract ended(gl: AnyWebRenderingGLContext, nbPoints: number, nbIndices: number): void;

    destroy(){
        this._vao.destroy();
        this._buffer.destroy();
    }


}
