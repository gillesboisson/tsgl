import {vec4} from "gl-matrix";
import {GLTexture} from "../gl/core/GLTexture";
import {WithUv} from "../gl/data/InterleavedData";

export class SubTexture{
    get x(){
        return this.uv[0] * this._texture.width;
    }

    get y(){
        return this.uv[1] * this._texture.height;
    }

    get width(){
        return (this.uv[6] - this.uv[0])  * this._texture.width;
    }

    get height(){
        return (this.uv[7] - this.uv[1]) * this._texture.height;
    }

    uv: Float32Array;

    constructor(
        protected _texture: GLTexture,
        x:number = 0,
        y:number = 0,
        width: number = _texture.width,
        height: number = _texture.height
    ){
        this.uv = new Float32Array(8);
        this.setBounds(x,y,width,height);
    }

    setBounds(x:number, y:number, width: number, height: number){
        this.setBoundsRect(x,y,x + width, y + height);
    }

    setBoundsRect(left:number, top:number, right: number, bottom: number){
        this.setBoundUv(
            left / this._texture.width,
            top / this._texture.height,
            right / this._texture.width,
            bottom / this._texture.height,
        );
    }

    setBoundUv(left:number, top:number, right: number, bottom: number){
        this.uv[0] = this.uv[4] = left;
        this.uv[1] = this.uv[3] = top;
        this.uv[2] = this.uv[6] = right;
        this.uv[5] = this.uv[7] = bottom;
    }
}
