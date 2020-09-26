import { interleavedData, interleavedProp } from './InterleavedData.decorator';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { vec3, vec4 } from 'gl-matrix';
import { IInterleavedData, InterleavedDataArray } from './InterleavedData';
import { GLInterleavedAttributes } from '../core/data/GLInterleavedAttributes';
import {} from './PositionUv';

@GLInterleavedAttributes()
@interleavedData()
export class PositionUvColor implements IInterleavedData {
  @interleavedProp({
    type: Float32Array,
    length: 3,
    attributeLocation: GLDefaultAttributesLocation.POSITION,
  })
  public position: vec3;

  @interleavedProp({
    type: Float32Array,
    length: 2,
    attributeLocation: GLDefaultAttributesLocation.UV,
  })
  @interleavedProp({
    type: Float32Array,
    length: 4,
    attributeLocation: GLDefaultAttributesLocation.COLOR,
  })
  public color: vec4;

  static get stride(): number {
    return 9 * Float32Array.BYTES_PER_ELEMENT;
  }

  allocate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    array: InterleavedDataArray<IInterleavedData>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arrayBuffer: ArrayBuffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    offset: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stride: number,
  ): void {}
}
