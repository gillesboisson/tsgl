import {GLCore} from "../GLCore";
import {AnyWebRenderingGLContext} from "../GLHelpers";



export class GLUniformsData extends GLCore {
    protected _uniforms: { [name: string]: WebGLUniformLocation };

    constructor(gl: AnyWebRenderingGLContext, protected _program: WebGLProgram) {
        super(gl);
        this._uniforms = {};
    }

    sync(propertyName? :string){ throw new Error('Not implemented')}

    syncFuncs:{[name: string]: () => void };

    destroy(): void {
    }
}
