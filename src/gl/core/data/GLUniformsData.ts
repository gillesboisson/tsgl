import {GLCore} from "../GLCore";
import {AnyWebRenderingGLContext} from "../GLHelpers";
import { ShaderUniformProp } from "./GLUniformData.decorator";


export interface GLUniformsDataType<T extends GLUniformsData> extends Function {
    new (gl: AnyWebRenderingGLContext, program: WebGLProgram) :T    
}

export class GLUniformsData extends GLCore {
    protected _uniforms: { [name: string]: WebGLUniformLocation };
    private __arrayProps: ShaderUniformProp[];

    constructor(gl: AnyWebRenderingGLContext, protected _program: WebGLProgram) {
        super(gl);
        this._uniforms = {};
    }

    sync(propertyName? :string){ throw new Error('Not implemented')}

    syncFuncs:{[name: string]: () => void };

    destroy(): void {
    }
}
