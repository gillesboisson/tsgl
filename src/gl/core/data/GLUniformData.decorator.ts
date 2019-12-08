
export interface ShaderUniformProp{
    propName: string,
    name: string,
    uniformType: string,
    length: number
}

export function glShaderUniformProp(uniformType: string,length: number = 1, name: string = '')

{
    return function (target: any, propName: string | Symbol) {
        const prop: ShaderUniformProp = {
            propName: propName as string,
            name: name !== '' ? name : propName as string,
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

                    
            };

            construct.prototype = prototype;

            return construct;
        }
    }
}
