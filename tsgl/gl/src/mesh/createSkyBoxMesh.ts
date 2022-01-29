import { GLAttribute } from '..';
import { GLBuffer } from '..';
import { GLDefaultAttributesLocation } from '..';
import { GLMesh } from '..';
import { AnyWebRenderingGLContext } from '..';

export function createSkyBoxMesh(gl: AnyWebRenderingGLContext, size = 1): GLMesh {
  const radius = size / 2.0;
  const position = new Float32Array([
    -size,
    size,
    size,
    size,
    size,
    size,
    -size,
    -size,
    size,
    size,
    -size,
    size,
    size,
    size,
    -size,
    -size,
    size,
    -size,
    size,
    -size,
    -size,
    -size,
    -size,
    -size,
  ]);

  const indices = new Uint16Array([
    0,
    1,
    2,
    1,
    3,
    2,
    4,
    5,
    6,
    5,
    7,
    6,
    1,
    4,
    3,
    4,
    6,
    3,
    5,
    0,
    7,
    0,
    2,
    7,
    5,
    4,
    0,
    4,
    1,
    0,
    2,
    3,
    7,
    3,
    6,
    7,
  ]);

  const positionBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, position);
  const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, indices);

  const attributes = [new GLAttribute(gl, positionBuffer, GLDefaultAttributesLocation.POSITION, 'position', 3, 12)];

  return new GLMesh(gl, 8, 12, attributes, indexBuffer);
}
