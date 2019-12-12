import {GLCore} from "../GLCore";
import {AnyWebRenderingGLContext} from "../GLHelpers";
import {GLTexture} from "../GLTexture";
import {GLSupport} from "../GLSupport";
import {IGLFrameBuffer} from "./IGLFrameBuffer";

export class GLFramebuffer extends GLCore implements IGLFrameBuffer{
    get depthTexture(): GLTexture {
        return this._depthTexture;
    }
    get colorTexture(): GLTexture {
        return this._colorTexture;
    }

    get width(){ return this._width; }
    get height(){ return this._height; }


    private _frameBuffer: WebGLFramebuffer;
    private _colorTexture: GLTexture;
    private _depthRenderBuffer: WebGLRenderbuffer;
    private _colorRenderBuffer: WebGLRenderbuffer;

    private _depthTexture: GLTexture;
    private _previousViewport: Int32Array = null;
    constructor(
        gl: AnyWebRenderingGLContext,
        protected _width: number,
        protected _height: number,
        protected _useDepthTexture: boolean = false,
        protected _useColorTexture: boolean = true,
        protected _depthEnabled: boolean = false,
        protected _useMipmap: boolean = false,
    ){
        super(gl);
        this._frameBuffer = gl.createFramebuffer();


        if(_useColorTexture){
            this._colorTexture = new GLTexture(gl, gl.TEXTURE_2D, _width, _height, _useMipmap);
            // this._colorTexture.setEmpty(gl.RGBA);
        }else{
            this._colorRenderBuffer = gl.createRenderbuffer();
        }

        if(_useDepthTexture){
            GLSupport.depthTextureSupported(gl, true, true);
            this._depthTexture = new GLTexture(gl, gl.TEXTURE_2D, _width, _height, _useMipmap);
            // this._depthTexture.setEmpty(gl.RGBA);
        }

        if(!_useDepthTexture && _depthEnabled){
            this._depthRenderBuffer = gl.createRenderbuffer();
        }


        this.updateSettings();
    }

    updateSettings(){
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

        if(this._useColorTexture) {
            const colorTexture = this._colorTexture.texture;
            gl.bindTexture(gl.TEXTURE_2D, colorTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            if (this._useMipmap) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);

            gl.bindTexture(gl.TEXTURE_2D, null);

        }else{
            this.gl.bindRenderbuffer(gl.RENDERBUFFER, this._colorRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, this._width, this._height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this._depthRenderBuffer);
        }


        if (this._useDepthTexture) {
            const depthTexture = this._depthTexture.texture;

            gl.bindTexture(gl.TEXTURE_2D, depthTexture);


            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                (gl as any).depthTextureExt !== undefined ? gl.DEPTH_COMPONENT : gl.DEPTH_COMPONENT16,
                this._width,
                this._height,
                0,
                gl.DEPTH_COMPONENT,
                gl.UNSIGNED_SHORT,
                null
            );

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        } else if(this._depthEnabled){
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
        }


        // unbind
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    resize(width: number, height: number) {
        this._width = width;
        this._height = height;

        if(this._colorTexture !== undefined) this._colorTexture.resize(width, height);
        if(this._depthTexture !== undefined) this._depthTexture.resize(width, height);

        this.updateSettings();
    }

    bind() {
        this._previousViewport = this.gl.getParameter(this.gl.VIEWPORT);
        this.gl.viewport(0, 0, this._width, this._height);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
    }

    unbind() {
        if(this._previousViewport === null) throw new Error('Frame buffer has never been bind');
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(
            this._previousViewport[0],
            this._previousViewport[1],
            this._previousViewport[2],
            this._previousViewport[3]
        );
        this._previousViewport = null;
    }

    destroy(): void {
        this.gl.deleteFramebuffer(this._frameBuffer);
        if(this._useColorTexture) this._colorTexture.destroy();
        if(this._useDepthTexture){
            this._depthTexture.destroy();
        }

        if(this._depthRenderBuffer !== undefined){
            this.gl.deleteRenderbuffer(this._depthRenderBuffer);
        }

        if(this._colorRenderBuffer !== undefined){
            this.gl.deleteRenderbuffer(this._colorRenderBuffer);
        }
    }
}
