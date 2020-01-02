import { interleavedData } from './InterleavedData.decorator';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { vec2, vec3, vec4 } from 'gl-matrix';
import { InterleavedDataArray } from './InterleavedDataArray';
import { IInterleaveData } from './IInterleaveData';
import { glInterleavedAttributes } from '../core/data/gLInterleavedAttributes';
import { structAttr } from '../../core/decorators/StructAttribute';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import { GLBuffer } from '../core/data/GLBuffer';
import { GLAttribute } from '../core/data/GLAttribute';

@glInterleavedAttributes()
@interleavedData()
export class PositionColor implements IInterleaveData {
  // Static ====================================

  static byteLength: number;
  static createAttributes: (gl: AnyWebRenderingGLContext, buffer: GLBuffer, stride?: number) => GLAttribute[];

  @structAttr({
    type: Float32Array,
    gl: { name: 'position', location: GLDefaultAttributesLocation.POSITION },
    length: 3,
  })
  position: vec3;

  @structAttr({
    type: Float32Array,
    gl: { name: 'position', location: GLDefaultAttributesLocation.COLOR },
    length: 4,
  })
  color: vec4;

  allocate: (arrayBuffer: ArrayBuffer, offset: number, stride: number) => void;
}
