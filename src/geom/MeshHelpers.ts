import { AnyWebRenderingGLContext } from '../gl/core/GLHelpers';
import { GLBuffer } from '../gl/core/data/GLBuffer';
import { GLAttribute } from '../gl/core/data/GLAttribute';
import { GLDefaultAttributesLocation } from '../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../gl/core/data/GLMesh';

export interface QuadSettings {
  quadLeft: number;
  quadTop: number;
  quadRight: number;
  quadBottom: number;
  quadDepth: number;
  uvLeft: number;
  uvRight: number;
  uvTop: number;
  uvBottom: number;
}

// default quad settings : flip UV Y
export function defaultQuadSettings(): QuadSettings {
  return {
    quadLeft: -1,
    quadTop: -1,
    quadRight: 1,
    quadBottom: 1,
    quadDepth: 0,
    uvLeft: 0,
    uvRight: 1,
    uvTop: 1,
    uvBottom: 0,
  };
}

/**
 *
 * @param nbQuads requested quad count
 */
export default function generateDefaultQuadIndices(nbQuads: number): Uint16Array {
  const nbIndices = nbQuads * 6;
  const result = new Uint16Array(nbIndices);

  for (let i = 0; i < nbQuads; i++) {
    const quadInd = i * 4;
    const IndicesInd = i * 6;

    result[IndicesInd] = quadInd;
    result[IndicesInd + 1] = quadInd + 1;
    result[IndicesInd + 2] = quadInd + 2;
    result[IndicesInd + 3] = quadInd + 1;
    result[IndicesInd + 4] = quadInd + 3;
    result[IndicesInd + 5] = quadInd + 2;
  }

  return result;
}

/**
 *
 * @param positions 2D position flat array
 * @param uvs 2D uvs flat array
 * @param indices triangles indices if not provided a default quad indices is generated (0,1,2,3,2,1,...)
 */
export function createUVCropMesh(
  gl: AnyWebRenderingGLContext,
  positions: Float32Array,
  uvs: Float32Array,
  indices?: Uint16Array,
  drawType = gl.STATIC_DRAW,
): GLMesh {
  if (!indices) indices = generateDefaultQuadIndices(positions.length / 8);

  const positionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
  positionBuffer.bufferData(positions);

  const uvBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
  uvBuffer.bufferData(uvs);

  const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, drawType);
  quadIndexB.bufferData(indices);

  const attrs = [
    new GLAttribute(gl, positionBuffer, GLDefaultAttributesLocation.POSITION, 'position', 2, 8),
    new GLAttribute(gl, uvBuffer, GLDefaultAttributesLocation.UV, 'uv', 2, 8),
  ];

  return new GLMesh(gl, positions.length / 2, indices.length / 3, attrs, quadIndexB);
}

export function createQuadMesh(
  gl: AnyWebRenderingGLContext,
  settings?: Partial<QuadSettings>,
  drawType: GLenum = gl.STATIC_DRAW,
): GLMesh {
  const { quadLeft, quadTop, quadRight, quadBottom, quadDepth, uvLeft, uvRight, uvTop, uvBottom } = {
    ...settings,
    ...defaultQuadSettings(),
  };

  const quadB = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
  const bData = new Float32Array([
    quadLeft,
    quadTop,
    quadDepth,
    uvLeft,
    uvTop,
    quadRight,
    quadTop,
    quadDepth,
    uvRight,
    uvTop,
    quadLeft,
    quadBottom,
    quadDepth,
    uvLeft,
    uvBottom,
    quadRight,
    quadBottom,
    quadDepth,
    uvRight,
    uvBottom,
  ]);

  quadB.bufferData(new Float32Array(bData));

  const quadIndex = new Uint16Array([0, 1, 2, 1, 3, 2]);
  const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, drawType);
  quadIndexB.bufferData(quadIndex);

  const attrs = [
    new GLAttribute(gl, quadB, GLDefaultAttributesLocation.POSITION, 'position', 3, 20),
    new GLAttribute(gl, quadB, GLDefaultAttributesLocation.UV, 'uv', 2, 20, 12),
  ];

  return new GLMesh(gl, 4, 2, attrs, quadIndexB);
}

export function createWiredBoxMesh(
  gl: AnyWebRenderingGLContext,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  drawType: GLenum = gl.STATIC_DRAW,
): GLMesh {
  const quadB = new GLBuffer(gl, gl.ARRAY_BUFFER, drawType);
  quadB.bufferData(new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]));

  const quadIndex = new Uint16Array([0, 1, 2, 1, 3, 2]);
  const quadIndexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, drawType);
  quadIndexB.bufferData(quadIndex);

  const attrs = [
    new GLAttribute(gl, quadB, GLDefaultAttributesLocation.POSITION, 'position', 3, 5 * 4),
    new GLAttribute(gl, quadB, GLDefaultAttributesLocation.UV, 'uv', 2, 5 * 4, 3 * 4),
  ];

  return new GLMesh(gl, 4, 2, attrs, quadIndexB);
}
