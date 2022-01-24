import { GLAttribute } from '../../gl/core/data/GLAttribute';
import { GLBuffer } from '../../gl/core/data/GLBuffer';
import { GLDefaultAttributesLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';

export function createPlaneMesh(
  gl: AnyWebRenderingGLContext,
  width = 1,
  height = 1,
  widthSegments = 1,
  heightSegments = 1,
): GLMesh {
  // this.parameters = {
  //   width: width,
  //   height: height,
  //   widthSegments: widthSegments,
  //   heightSegments: heightSegments,
  // };

  const width_half = width / 2;
  const height_half = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segment_width = width / gridX;
  const segment_height = height / gridY;

  //

  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segment_height - height_half;

    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segment_width - width_half;

      vertices.push(x, -y, 0);

      normals.push(0, 0, 1);

      uvs.push(ix / gridX);
      uvs.push(1 - iy / gridY);
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const positionsB = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, new Float32Array(vertices));
  const normalsB = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, new Float32Array(normals));
  const uvsB = new GLBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, new Float32Array(uvs));
  const indexB = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, new Uint16Array(indices));

  return new GLMesh(
    gl,
    vertices.length / 3,
    indices.length / 3,
    [
      new GLAttribute(gl, positionsB, GLDefaultAttributesLocation.POSITION, 'a_position', 3, 12),
      new GLAttribute(gl, normalsB, GLDefaultAttributesLocation.NORMAL, 'a_normal', 3, 12),
      new GLAttribute(gl, uvsB, GLDefaultAttributesLocation.UV, 'a_uv', 2, 8),
    ],
    indexB,
  );
}
