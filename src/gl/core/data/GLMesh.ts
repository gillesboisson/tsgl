import {AnyWebRenderingGLContext} from "../Helpers";
import {GLAttribute} from "./GLAttribute";
import {GLBuffer} from "./GLBuffer";
import {GLCore} from "../GLCore";
import {GLVao} from "./GLVao";

export class GLMesh extends GLCore{

    static indicesSize(gl: AnyWebRenderingGLContext, renderType: GLenum): number{

        if (renderType === gl.POINTS) {
            return 1;
        } else if (renderType === gl.LINES || renderType === gl.LINE_LOOP || renderType === gl.LINE_STRIP) {
            return 2;
        } else if (renderType === gl.TRIANGLES || renderType === gl.TRIANGLE_STRIP || renderType === gl.TRIANGLE_FAN) {
            return 3;
        }
    }


    get vao(): GLVao {
        return this._vao;
    }

    get isInstanced(): boolean{
        return this._nbInstances > 0;
    }

    private _vao: GLVao;
    private _indicesSize: number;

    protected _nbInstances = 0;
    private buffers: GLBuffer[];

    constructor(
        gl: AnyWebRenderingGLContext,
        protected _nbPoints: number,
        protected _nbElements: number,
        protected _attributes: GLAttribute[],
        protected _indexBuffer?: GLBuffer,
        protected _renderType: GLenum = gl.TRIANGLES
    ){
        super(gl);
        this._vao = new GLVao(gl, _attributes, _indexBuffer);

        this.buffers = [];
        for(let attr of _attributes){
            if(this.buffers.indexOf(attr.buffer) === -1) this.buffers.push(attr.buffer);
        }

        this._indicesSize = GLMesh.indicesSize(gl, _renderType);

    }

    destroy(): void {
        this._vao.destroy();
    }

    setInstanced(nbInstances: number){
        this._nbInstances = nbInstances;
    }

    unsetInstanced(){
        this._nbInstances = 0;
    }

    bufferData(){
        for(let buffer of this.buffers){
            buffer.bufferSubData();
        }
    }

    draw(
        nbElements: number = this._nbElements,
        start: number = 0,
        nbInstances: number = this._nbInstances,
        bindVao: boolean = true,
    ){
        if(bindVao === true) this._vao.bind();
        if(this._nbInstances > 0){
            if(this.vao.indexBuffer !== undefined) {

                // use GLSupport polyfill
                (this.gl as WebGL2RenderingContext).drawElementsInstanced(
                    this._renderType,
                    nbElements * this._indicesSize,
                    this.gl.UNSIGNED_SHORT,
                    start * this._indicesSize,
                    nbInstances
                );
            }else{
                (this.gl as WebGL2RenderingContext).drawArraysInstanced(
                    this._renderType,
                    start,nbElements,
                    nbInstances
                );
            }
        }else{
            if(this.vao.indexBuffer !== undefined) {
                this.gl.drawElements(
                    this._renderType,
                    nbElements * this._indicesSize,
                    this.gl.UNSIGNED_SHORT,
                    start * this._indicesSize
                );
                // debugger;
            }else{
                this.gl.drawArrays(this._renderType,start,nbElements);
            }
        }
        if(bindVao === true) this._vao.unbind();
    }


}
