import {vec4} from "gl-matrix";
import {AnyWebRenderingGLContext} from "./Helpers";
import {GLCore} from "./GLCore";


export enum GLRendererType{
  WebGL,
  WebGL2,
}


export class GLRenderer extends GLCore{

    static createFromCanvas(
        canvas: HTMLCanvasElement,
        type: GLRendererType = GLRendererType.WebGL,
        rendererClass: any = GLRenderer
    ): GLRenderer{
        const gl = canvas.getContext(type === GLRendererType.WebGL ? 'webgl' : 'webgl2');
        return new rendererClass(gl, type, canvas) as GLRenderer;
    }

    static create(width: number,
                  height: number,
                  type: GLRendererType = GLRendererType.WebGL,
                  rendererClass: any = GLRenderer
                  ): GLRenderer{
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return this.createFromCanvas(canvas,type,rendererClass);

    }

    private _width: number;
    private _height: number;
    private _clearColor: vec4;

    constructor(gl: AnyWebRenderingGLContext, public type: GLRendererType, public canvas: HTMLCanvasElement){
        super(gl);
        this._width = canvas.width;
        this._height = canvas.height;

        this._clearColor = vec4.fromValues(0,0,0,1);
        this.gl.clearColor(
            this._clearColor[0],
            this._clearColor[1],
            this._clearColor[2],
            this._clearColor[3]
        );



        this.setup();
    }

    set clearColor(clearColor: vec4){
        vec4.copy(this._clearColor,clearColor);
        this.gl.clearColor(clearColor[0],clearColor[1],clearColor[2],clearColor[3]);
    }

    setup() {
        this.gl.enable(this.gl.CULL_FACE);                              // Active le test de profondeur
        this.gl.enable(this.gl.DEPTH_TEST);                             // Active le test de profondeur
        this.gl.depthFunc(this.gl.LESS);                                // Les objets proches cachent les objets lointains

        this.gl.enable(this.gl.BLEND);
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA); // premultiply alpha
    }

    clear(clearFlags: number = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT){
        this.gl.clear(clearFlags);
    }

    destroy(): void {

    }




}
