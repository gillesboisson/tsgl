import { interleavedData, interleavedProp } from './InterleavedData.decorator';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { vec2, vec3 } from 'gl-matrix';
import { IInterleavedData, InterleavedDataArray } from './InterleavedData';
import { GLInterleavedAttributes } from '../core/data/GLInterleavedAttributes';

@GLInterleavedAttributes()
@interleavedData()
export class PositionUv implements IInterleavedData {
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
  public uv: vec2;

  allocate: (array: InterleavedDataArray<PositionUv>, arrayBuffer: ArrayBuffer, offset: number, stride: number) => void;
}
