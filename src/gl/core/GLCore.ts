import {AnyWebRenderingGLContext} from "./GLHelpers";
import { IDestroyable } from "../../pool/Pool";

export interface IGLCore extends IDestroyable{
    getGL(): AnyWebRenderingGLContext;
}

export abstract class GLCore implements IGLCore{
    constructor(protected gl: AnyWebRenderingGLContext) {}
    getGL(): AnyWebRenderingGLContext {
        return this.gl;
    }

    abstract destroy(): void;

}
