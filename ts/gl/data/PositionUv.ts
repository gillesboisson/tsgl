import { interleavedData } from './InterleavedData.decorator';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { vec2, vec3 } from 'gl-matrix';
import { InterleavedDataArray } from './InterleavedDataArray';
import { IInterleaveData } from './IInterleaveData';
import { glInterleavedAttributes } from '../core/data/gLInterleavedAttributes';
import { structAttr } from '../../core/decorators/StructAttribute';

@glInterleavedAttributes()
@interleavedData()
export class PositionUv implements IInterleaveData {
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
  public uv: vec2;

  allocate: (array: InterleavedDataArray<PositionUv>, arrayBuffer: ArrayBuffer, offset: number, stride: number) => void;
}
