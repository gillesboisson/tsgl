import { interleavedData } from './InterleavedData.decorator';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { vec2, vec3, vec4 } from 'gl-matrix';
import { IInterleavedData, InterleavedDataArray } from './InterleavedData';
import { glInterleavedAttributes } from '../core/data/gLInterleavedAttributes';
import { PositionUv } from './PositionUv';
import { structAttr } from '../../core/decorators/StructAttribute';

@glInterleavedAttributes()
@interleavedData()
export class PositionUvColor implements IInterleavedData {
  @structAttr({
    type: Float32Array,
    length: 3,
    gl: { location: GLDefaultAttributesLocation.POSITION },
  })
  public position: vec3;

  @structAttr({
    type: Float32Array,
    length: 2,
    gl: { location: GLDefaultAttributesLocation.UV },
  })
  @structAttr({
    type: Float32Array,
    length: 4,
    gl: { location: GLDefaultAttributesLocation.COLOR },
  })
  public color: vec4;

  static get stride(): number {
    return 9 * Float32Array.BYTES_PER_ELEMENT;
  }

  allocate(
    array: InterleavedDataArray<IInterleavedData>,
    arrayBuffer: ArrayBuffer,
    offset: number,
    stride: number,
  ): void {}
}
