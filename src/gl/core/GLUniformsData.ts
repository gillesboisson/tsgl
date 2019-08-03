import {GLCore} from "./GLCore";
import {AnyWebRenderingGLContext} from "./Helpers";

export function glShaderUniformProp(uniformType: string,length: number = 1, name: string = '')

{
    return function (target: any, propName: string | Symbol) {
        const prop = {
            propName,
            name: name !== '' ? name : propName,
            uniformType,
            length
        };

        if (!target.__arrayProps) {
            target.__arrayProps = [prop];
        } else {
            target.__arrayProps.push(prop);
        }
    }
}

export function glShaderUniforms() {
    return function (target: any) {
        const prototype = target.prototype;
        if (prototype.__arrayProps) {

            const construct: any = function (this: any) {
                target.apply(this, arguments);

                this.gl.useProgram(this._program);

                for (let prop of prototype.__arrayProps) {
                    const location = this._uniforms[prop.propName] = this.gl.getUniformLocation(this._program, prop.name);
                    if (this._uniforms[prop.name] === null) {
                        throw console.warn(
                            'no uniform found for ' + prop.name + ' | prop ' + prop.propName,
                            prototype
                        )
                    }

                    const funcUName = 'uniform' + prop.length.toString() + prop.uniformType + (prop.length > 1 ? 'v' : '');
                    console.log('funcUName : ', funcUName,this.gl[funcUName]);
                    const funcU = this.gl[funcUName].bind(this.gl);



                    const set = function(val: number){

                        funcU(location, val);
                        this['__'+prop.propName] = val;
                    };

                    const get = function(){
                        return this['__'+prop.propName];
                    };

                    const val = this[prop.propName];

                    Object.defineProperty(this,prop.propName,{get,set});

                    if(val !== undefined) this[prop.propName] = val;

                }
            };

            construct.prototype = prototype;

            return construct;
        }
    }
}

export default class GLUniformsData extends GLCore {
    protected _uniforms: { [name: string]: WebGLUniformLocation };

    constructor(gl: AnyWebRenderingGLContext, protected _program: WebGLProgram) {
        super(gl);
        this._uniforms = {};
    }

    sync(propertyName? :string){ throw new Error('Not implemented')}

    destroy(): void {
    }
}
