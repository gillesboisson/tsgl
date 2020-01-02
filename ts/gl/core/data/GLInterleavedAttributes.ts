import { AnyWebRenderingGLContext } from '../GLHelpers';
import { GLBuffer } from './GLBuffer';
import { GLAttribute } from './GLAttribute';
import { StructAttributeProp, getStructAttributesByteLength } from '../../../core/decorators/StructAttribute';

export function glInterleavedAttributes() {
  return function(target: any) {
    target.byteLength = getStructAttributesByteLength(target.prototype.__anPropsList);

    if (target.prototype.__anPropsList) {
      const createAttributes = target.createAttributes;

      target.createAttributes = function(
        gl: AnyWebRenderingGLContext,
        buffer: GLBuffer,
        stride: number = target.byteLength,
      ) {
        const attrs: GLAttribute[] = createAttributes ? createAttributes.apply(target, arguments) : [];
        let length = 0;
        let prop: StructAttributeProp;
        for (prop of target.prototype.__anPropsList) {
          if (prop.gl === undefined) throw new Error('No vertex attribute defined in ' + target + '::' + prop.name);
          if (prop.gl.location !== undefined) {
            const propOffset = prop.offset === -1 ? length : prop.offset;
            const nLength = propOffset + prop.type.BYTES_PER_ELEMENT * prop.length;
            if (length < nLength) length = nLength;

            attrs.push(
              new GLAttribute(
                gl,
                buffer,
                prop.gl.location,
                prop.gl.name,
                prop.length,
                stride,
                propOffset,
                prop.gl.type(gl),
                prop.gl.normalize,
              ),
            );
          }
        }

        return attrs;
      };
    }
  };
}
