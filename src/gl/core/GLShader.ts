import {AnyWebRenderingGLContext} from "./GLHelpers";
import {GLCore} from "./GLCore";
import {GLUniformsData, GLUniformsDataType} from "./data/GLUniformsData";

export interface IGLShader<GLUniformsDataT extends GLUniformsData>{
    // get uniforms(): GLUniformsDataT;
    use(): void;
    getUniforms(): GLUniformsDataT;
}

export type GLShaderPrecompileFlags = {
    [key: string]: string,
}

export class GLShader<GLUniformsDataT extends GLUniformsData = GLUniformsData> extends GLCore implements IGLShader<GLUniformsDataT>{



    public static compileProgram(
        gl: AnyWebRenderingGLContext,
        vertexSrc: string,
        fragmentSrc: string,
        attributeLocations?: {[name: string]: number },
        flags?: GLShaderPrecompileFlags,
        beforeLink?: (gl: AnyWebRenderingGLContext, program: WebGLProgram) => void
    ): WebGLProgram {

        var glVertShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSrc,flags);
        var glFragShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc, flags);

        var program = gl.createProgram();

        gl.attachShader(program, glVertShader);
        gl.attachShader(program, glFragShader);

        // optionally, set the attributesLocation manually for the program rather than letting WebGL decide..

        if (attributeLocations !== null) {
            for (var i in attributeLocations) {
                gl.bindAttribLocation(program, attributeLocations[i], i);
            }
        }

        if (beforeLink !== undefined)
            beforeLink(gl, program);


        gl.linkProgram(program);

        // if linking fails, then log and cleanup
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('GLSL Error: Could not initialize shader.');
            console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
            console.error('gl.getError()', gl.getError());

            // if there is a program info log, log it
            if (gl.getProgramInfoLog(program) !== '') {
                console.warn('GLSL Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
            }

            gl.deleteProgram(program);
            program = null;
        }

        // clean up some shaders
        gl.deleteShader(glVertShader);
        gl.deleteShader(glFragShader);

        return program;
    }

    public static compileShader(
        gl: AnyWebRenderingGLContext,
        shaderType: GLenum,
        src: string,
        flags?: GLShaderPrecompileFlags,
    ): WebGLShader {

        const shader = gl.createShader(shaderType);
        let defines = ``;
        if(flags !== undefined){
            for (const key in flags) {
                if (flags.hasOwnProperty(key)) {
                    defines += `#define ${key} ${flags[key]}\n`
                }
            }
            const srcSPL = src.split("\n");
            
            srcSPL.splice(1,0,defines);
            src = srcSPL.join("\n");
        }

        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    protected _program: WebGLProgram;
    protected _uniforms: GLUniformsDataT;

    constructor(
        gl: AnyWebRenderingGLContext,
        protected vertexSrc: string,
        protected fragmentSrc: string,
        UniformDataTClass?: GLUniformsDataType<GLUniformsDataT>,
        attributesLocations? : {[name: string]: number},
        protected flags?: GLShaderPrecompileFlags,
    ){
        super(gl);
        this._program = GLShader.compileProgram(gl, vertexSrc, fragmentSrc, attributesLocations, flags);

        if(UniformDataTClass !== undefined) {
            this._uniforms = new UniformDataTClass(gl, this._program) as GLUniformsDataT;
        }
    }

    use(){
       this.gl.useProgram(this._program);
    }

    destroy(){
        this.gl.deleteProgram(this._program);
    }

    get program(): WebGLProgram{
        return this._program;
    }

    getUniforms(): GLUniformsDataT {
        return this._uniforms;
    }




}
