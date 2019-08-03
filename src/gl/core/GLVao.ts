import {GLBuffer} from "./GLBuffer";
import {GLCore} from "./GLCore";
import {AnyWebRenderingGLContext} from "./Helpers";
import {GLAttribute} from "./GLAttribute";


export enum VaoSupportType {
    WEBGL2_VAO,
    OES_VAO,
}

export class GLVao extends GLCore{

    get attributes(): GLAttribute[] {
        return this._attributes;
    }
    get indexBuffer(): GLBuffer {
        return this._indexBuffer;
    }

    private _vao: WebGLVertexArrayObject | WebGLVertexArrayObjectOES;
    private _supportMode: VaoSupportType;
    private _vaoExt: OES_vertex_array_object;
    protected _attributes: GLAttribute[] = [];
    protected _indexBuffer?: GLBuffer;

    constructor(
        gl: AnyWebRenderingGLContext,
        _attributes: GLAttribute[] = [],
        _indexBuffer?: GLBuffer
    ){
        super(gl);
        this._indexBuffer = _indexBuffer;
        this._attributes = _attributes;


        if(gl.hasOwnProperty('createVertexArray')){ // vao supported natively (WebGL2)
            const gl2 = gl as WebGL2RenderingContext;
            this._vao = gl2.createVertexArray();

            this.bind = this.bindNat;
            this.unbind = this.unbindNat;
            this.destroy = this.destroyNat;

            this._supportMode = VaoSupportType.WEBGL2_VAO;
        }else{
            // Look for a vao extension
            this._vaoExt = gl.getExtension('OES_vertex_array_object') ||
                gl.getExtension('MOZ_OES_vertex_array_object') ||
                gl.getExtension('WEBKIT_OES_vertex_array_object');




            if(this._vaoExt) { // implement extension
                this._vao = this._vaoExt.createVertexArrayOES();
                // console.log('this.vao : ', this.vao);debugger;
                this.bind = this.bindExt;
                this.unbind = this.unbindExt;
                this.destroy = this.destroyExt;

                this._supportMode = VaoSupportType.OES_VAO;
            }else {
                throw new Error('Vao not supported');
            }

        }

        this.activate();
    }

    public getAttributes(): GLAttribute[]{
        return this._attributes;
    }

    private bindExt(){

        this._vaoExt.bindVertexArrayOES(this._vao);
    }

    private bindNat(){
        (this.gl as WebGL2RenderingContext).bindVertexArray(this._vao);
    }

    private unbindExt(){
        this._vaoExt.bindVertexArrayOES(null);
    }

    private unbindNat(){
        (this.gl as WebGL2RenderingContext).bindVertexArray(null);
    }


    private destroyExt(){
        this._vaoExt.deleteVertexArrayOES(this._vao);
    }

    private destroyNat(){
        (this.gl as WebGL2RenderingContext).deleteVertexArray(this._vao);
    }

    public activate(){
        this.bind();

        this.activeGeom();

        this.unbind();
    }

    public activeGeom() {
        for(const attr of this._attributes){
            attr.activate();
        }
        if(this._indexBuffer !== undefined)
            this._indexBuffer.bind();
    }

    // dynamically assigned based on WebGL VAO implementation (VaoSupportType)
    public unbind() {};
    public bind() {};
    public destroy() {};
}
