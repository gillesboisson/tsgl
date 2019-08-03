import {GLCore} from "./GLCore";
import {AnyWebRenderingGLContext} from "./Helpers";
import {GLSupport} from "./GLSupport";
import {GLTexture} from "./GLTexture";

export class MRTFrameBuffer extends GLCore{
    private _isWebGL2: any;
    private _frameBuffer: WebGLFramebuffer;
    private _textures: GLTexture[];
    private _depthTexture: GLTexture;
    private _depthRenderBuffer: WebGLFramebuffer;
    private _colorsAttachements: GLenum[];
    private _previousViewport: Int32Array = null;


    constructor(
        gl: AnyWebRenderingGLContext,
        protected _width: number,
        protected _height: number,
        protected _nbLayers: number,
        protected _useDepthTexture = false,
        protected _depthEnabled: boolean = true,

    ){
        super(gl);
        GLSupport.MRTFrameBufferSupported(gl, true, true);

        if(_useDepthTexture) {
            GLSupport.depthTextureSupported(gl,true, true);
        }

        this._isWebGL2 = GLSupport.webGL2Supported(gl as WebGL2RenderingContext);
        this._frameBuffer = gl.createFramebuffer();

        this._textures = [];

        for(let i=0 ; i< _nbLayers ; i++){
            let texture = new GLTexture(gl, gl.TEXTURE_2D, _width, _height);

            this._textures.push(texture);
        }

        if(_useDepthTexture) {
            this._depthTexture = new GLTexture(gl, gl.TEXTURE_2D, _width, _height);
        }else if(this._depthEnabled){
            this._depthRenderBuffer = gl.createRenderbuffer();

        }

        this.updateSettings();
    }

    updateSettings(){
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);



        this._colorsAttachements = new Array(this._nbLayers);

        // setup color textures
        if (this._isWebGL2) {
            // WEBGL 2 MRT
            const gl2 = gl as WebGL2RenderingContext;

            gl2.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                this._nbLayers,
                gl2.RGBA8,
                this._width,
                this._height
            );

            for(let i=0;i<this._nbLayers;i++){
                this._colorsAttachements[i] = gl2.COLOR_ATTACHMENT0+i;
                gl.framebufferTexture2D(
                    gl2.DRAW_FRAMEBUFFER,
                    gl2.COLOR_ATTACHMENT0+i,
                    gl.TEXTURE_2D,
                    this._textures[i].texture,
                    0
                );


                gl.bindTexture(gl.TEXTURE_2D, this._textures[i].texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    this._width,
                    this._height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null
                );
                gl.bindTexture(gl.TEXTURE_2D, null);
            }

        }else{

            for(let i=0;i<this._nbLayers; i++) {
                this._colorsAttachements[i] = (gl as any).drawBuffersExt.COLOR_ATTACHMENT0_WEBGL+i;
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    (gl as any).drawBuffersExt.COLOR_ATTACHMENT0_WEBGL+i,
                    gl.TEXTURE_2D,
                    this._textures[i].texture,
                    0
                );

                gl.bindTexture(gl.TEXTURE_2D, this._textures[i].texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    this._width,
                    this._height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null
                );
                gl.bindTexture(gl.TEXTURE_2D, null);

            }

        }


        // setup depth texture
        if(this._useDepthTexture){
            gl.bindTexture(this.gl.TEXTURE_2D, this._depthTexture.texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                (gl as any).depthTextureExt !== undefined
                    ? gl.DEPTH_COMPONENT
                    : gl.DEPTH_COMPONENT16,
                this._width,
                this._height,
                0,
                gl.DEPTH_COMPONENT,
                gl.UNSIGNED_SHORT,
                null
            );


            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthTexture, 0);
        }

        // setup depth render buffer
        if(this._depthRenderBuffer !== undefined) {
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }


        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    resize(width: number, height: number){
        this._width = width;
        this._height = height;

        for(let t of this._textures){
            t.resize(width,height);
        }

        if(this._depthTexture !== undefined) this._depthTexture.resize(width, height);

        this.updateSettings();
    }

    bind() {
        this._previousViewport = this.gl.getParameter(this.gl.VIEWPORT);

        this.gl.viewport(0, 0, this._width, this._height);

        // console.log("> this.gl.viewport",this.width,this.height);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._frameBuffer);
        if(this._isWebGL2)
            (this.gl as WebGL2RenderingContext).drawBuffers(this._colorsAttachements);
        else
            (this.gl as any).drawBuffersExt.drawBuffersWEBGL(this._colorsAttachements);
        // this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._renderbuffer);
    }

    /**
     * unbind shortcut method
     */
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
        for(let t of this._textures){
            t.destroy();
        }
        if(this._depthTexture !== undefined)
            this._depthTexture.destroy();

        if(this._depthRenderBuffer !== undefined)
            this.gl.deleteRenderbuffer(this._depthRenderBuffer);
    }
}
