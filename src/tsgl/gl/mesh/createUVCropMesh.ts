import { GLAttribute } from '../core/data/GLAttribute';
import { GLBuffer } from '../core/data/GLBuffer';
import { GLDefaultAttributesLocation } from '../core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../core/GLHelpers';
import generateDefaultQuadIndices from "./generateDefaultQuadIndices";

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
