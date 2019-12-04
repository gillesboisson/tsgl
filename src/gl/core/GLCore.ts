import {AnyWebRenderingGLContext} from "./GLHelpers";

export abstract class GLCore {
    constructor(protected gl: AnyWebRenderingGLContext) {}
    getGL(): AnyWebRenderingGLContext {
        return this.gl;
    }

    abstract destroy(): void;

}
