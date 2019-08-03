import { GLConfig} from "../GLConfig";
import {AnyWebRenderingGLContext} from "../Helpers";
import {GLCore} from "../GLCore";

export class GLBuffer extends GLCore{

    protected bufferIndex: WebGLBuffer;
    protected _data: ArrayBufferView;
    protected _drawType: GLenum;
    protected _target: GLenum;

    constructor(gl: AnyWebRenderingGLContext,
                _target: GLenum,
                _drawType: GLenum,
                _data?: ArrayBufferView,
    ){
        super(gl);
        this._target = _target;
        this._drawType = _drawType;
        this._data = _data;

        this.bufferIndex = gl.createBuffer();

        if(this._data !== undefined) this.bufferData(this._data);

    }

    destroy(){
        this.gl.deleteBuffer(this.bufferIndex);
    }

    bind(){
        this.gl.bindBuffer(this._target, this.bufferIndex);
    }

    unbind(){
        this.gl.bindBuffer(this._target, null);
    }

    activate(
        attrLocation: number,
        elementLength: number,
        verticesType: number = this.gl.FLOAT,
        normalize: boolean = false,
        stride: number = 0,
        offset:number = 0
        ){

        this.bind();
        this.gl.enableVertexAttribArray(attrLocation);
        this.gl.vertexAttribPointer(
            attrLocation,
            elementLength,
            verticesType,
            normalize,
            stride,
            offset);
    }


    bufferDataLength(byteLength: number){
        this.gl.bindBuffer(this._target, this.bufferIndex);
        this.gl.bufferData(this._target, byteLength, this._drawType);
        if(GLConfig.SafeBufferBinding === true)
            this.gl.bindBuffer(this._target, null);
    }

    bufferData(data: ArrayBufferView){
        this._data = data;

        this.gl.bindBuffer(this._target, this.bufferIndex);
        this.gl.bufferData(this._target, data, this._drawType);
        if(GLConfig.SafeBufferBinding === true)
            this.gl.bindBuffer(this._target, null);

    }

    bufferSubData(data: ArrayBufferView = this._data,
                  length?: number,
                  offset: number = 0,
                  offsetSrc: number = offset){
        this.gl.bindBuffer(this._target, this.bufferIndex);
        this.gl.bufferSubData(this._target, offset, data, offsetSrc, length);
        if(GLConfig.SafeBufferBinding === true)
            this.gl.bindBuffer(this._target, null);
    }
}




