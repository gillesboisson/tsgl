import { InterleavedDataArray, IInterleavedData } from '../gl/data/InterleavedData';
import { interleavedProp, interleavedData } from '../gl/data/InterleavedData.decorator';
import { vec2 } from 'gl-matrix';
import { GLInterleavedAttributes } from '../gl/core/data/GLInterleavedAttributes';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { GLAttribute } from '../gl/core/data/GLAttribute';
import { GLDefaultAttributesLocation } from '../gl/core/data/GLDefaultAttributesLocation';
@GLInterleavedAttributes()
@interleavedData()
export class TestTFdata implements IInterleavedData {
  static __byteLength: number;
  static createAttributes: (gl: WebGL2RenderingContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @interleavedProp({
    type: Float32Array,
    length: 2,
    attributeLocation: GLDefaultAttributesLocation.IPOSITION,
  })
  public position: vec2;
  @interleavedProp({
    type: Float32Array,
    length: 2,
    attributeLocation: GLDefaultAttributesLocation.IVELOCITY,
  })
  public velocity: vec2;
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
