import {GLCore} from "../GLCore";
import {AnyWebRenderingGLContext} from "../Helpers";
import {GLBuffer} from "./GLBuffer";



export class GLAttribute extends GLCore {

    get normalize(): boolean {
        return this._normalize;
    }

    set normalize(value: boolean) {
        this._normalize = value;
    }
    get type(): GLenum {
        return this._type;
    }

    set type(value: GLenum) {
        this._type = value;
    }
    get offset(): number {
        return this._offset;
    }
    get stride(): number {
        return this._stride;
    }

    set stride(value: number) {
        this._stride = value;
    }
    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }
    get name(): string {
        return this._name;
    }
    get location(): number {
        return this._location;
    }
    get buffer(): GLBuffer {
        return this._buffer;
    }

    protected _buffer: GLBuffer;
    protected _location: number;
    protected _name: string;
    protected _length: number;
    protected _stride: number;
    protected _offset: number;
    protected _type: GLenum;
    protected _normalize: boolean;
    public divisor: number = 0;

    constructor(
        gl: AnyWebRenderingGLContext,
        buffer: GLBuffer,
        location: number,
        name: string,
        length: number,
        stride: number,
        offset: number = 0,
        type: GLenum = gl.FLOAT,
        normalize: boolean = false,
    ) {
        super(gl);
        this._normalize = normalize;
        this._type = type;
        this._offset = offset;
        this._stride = stride;
        this._length = length;
        this._name = name;
        this._location = location;
        this._buffer = buffer;
    }

    activate() {
        this._buffer.bind();
        this.gl.vertexAttribPointer(this._location, this._length, this._type, this._normalize, this._stride, this._offset);
        this.gl.enableVertexAttribArray(this._location);

        // attribute used once per instance
        if(this.divisor > 0)
            (this.gl as WebGL2RenderingContext).vertexAttribDivisor(this.location,this.divisor);
    }

    destroy(): void {

    }

}
