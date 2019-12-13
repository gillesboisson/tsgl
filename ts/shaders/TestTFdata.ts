import { InterleavedDataArray, IInterleavedData } from '../gl/data/InterleavedData';
import { interleavedData } from '../gl/data/InterleavedData.decorator';
import { vec2 } from 'gl-matrix';
import { glInterleavedAttributes } from '../gl/core/data/gLInterleavedAttributes';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { GLAttribute } from '../gl/core/data/GLAttribute';
import { GLDefaultAttributesLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { structAttr } from '../core/decorators/StructAttribute';
@glInterleavedAttributes()
@interleavedData()
export class TestTFdata implements IInterleavedData {
  static __byteLength: number;
  static createAttributes: (gl: WebGL2RenderingContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @structAttr({
    type: Float32Array,
    length: 2,
    gl: { location: GLDefaultAttributesLocation.IPOSITION },
  })
  public position: vec2;
  @structAttr({
    type: Float32Array,
    length: 2,
    gl: { location: GLDefaultAttributesLocation.IVELOCITY },
  })
  public velocity: vec2;
  allocate(
    array: InterleavedDataArray<IInterleavedData>,
    arrayBuffer: ArrayBuffer,
    offset: number,
    stride: number,
  ): void {}
}
