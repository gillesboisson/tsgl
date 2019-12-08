import {AnyWebRenderingGLContext} from "../GLHelpers";
import {GLBuffer} from "./GLBuffer";
import {GLAttribute} from "./GLAttribute";

export function GLInterleavedAttributes(){
    return function (target: any) {

        if(target.prototype.__anPropsList) {
            const createAttributes = target.createAttributes;

            target.createAttributes = function (
                gl: AnyWebRenderingGLContext,
                buffer: GLBuffer,
                stride: number = target.__byteLength,
            ) {
                const attrs: GLAttribute[] = createAttributes ? createAttributes.apply(target, arguments) : [];
                let length = 0;

                for(const prop of target.prototype.__anPropsList) {
                    if (prop.attributeLocation !== undefined) {
                        const propOffset = prop.offset === -1 ? length : prop.offset;
                        const nLength = propOffset + prop.type.BYTES_PER_ELEMENT * prop.length;
                        if (length < nLength) length = nLength;

                        attrs.push(new GLAttribute(
                            gl,
                            buffer,
                            prop.attributeLocation,
                            prop.attributeName,
                            prop.length,
                            stride,
                            propOffset,
                            prop.attributeType(gl),
                            prop.attributeNormalize,
                        ));
                    }
                }

                return attrs;
            }

        }

    }
}
