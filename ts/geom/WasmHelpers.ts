import { box } from './box';
import { mat4 } from 'gl-matrix';

class WasmGeomHelpers {
  static _Box_setFromVertices: (
    boxPtr: number,
    verticesPtr: number,
    nbVertices: number,
    stride: number,
    offset: number,
    matPtr: number,
  ) => void;

  Box_setFromVertices(
    bounds: box,
    vertices: Float32Array,
    nbVertices: number,
    stride: number,
    offset: number,
    mat?: mat4,
  ) {
    WasmGeomHelpers._Box_setFromVertices(
      bounds.byteOffset,
      vertices.byteOffset,
      nbVertices,
      stride,
      offset,
      mat !== undefined ? mat.byteOffset : 0,
    );
  }

  static init(module: EmscriptenModule) {
    WasmGeomHelpers._Box_setFromVertices = module.cwrap('Box_setFromVertices', null, [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number',
    ]);
  }
}
