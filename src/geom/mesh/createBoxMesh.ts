import { vec2, vec3 } from 'gl-matrix';
import { GLAttribute } from '../../gl/core/data/GLAttribute';
import { GLBuffer } from '../../gl/core/data/GLBuffer';
import { GLDefaultAttributesLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';

export type CubeMeshUvDefinition = {
  left: number;
  top: number;
  right: number;
  bottom: number;
}[];

// canvas uv map is
//    +--+
//    |ny|
// +--+--+-----+
// |nx|pz|px|nz|
// +--+--+-----+
//    |py|
//    +--+
// based on square texture
// each face is 1/4 of the texture, a 1/4 bottom stripe is not used

export const cubeSquarePatronUv: CubeMeshUvDefinition = [
  { left: 2 / 4, right: 3 / 4, top: 2 / 4, bottom: 1 / 4 },
  { left: 0 / 4, right: 1 / 4, top: 2 / 4, bottom: 1 / 4 },
  { left: 1 / 4, right: 2 / 4, top: 1 / 4, bottom: 0 / 4 },
  { left: 1 / 4, right: 2 / 4, top: 3 / 4, bottom: 2 / 4 },
  { left: 3 / 4, right: 4 / 4, top: 2 / 4, bottom: 1 / 4 },
  { left: 1 / 4, right: 2 / 4, top: 2 / 4, bottom: 1 / 4 },



  
];



export const defaultCubeUvDefinition: CubeMeshUvDefinition = [
  { left: 0, right: 1, top: 1, bottom: 0 },
  { left: 0, right: 1, top: 1, bottom: 0 },
  { left: 0, right: 1, top: 1, bottom: 0 },
  { left: 0, right: 1, top: 1, bottom: 0 },
  { left: 0, right: 1, top: 1, bottom: 0 },
  { left: 0, right: 1, top: 1, bottom: 0 },
]

export function createBoxMesh(
  gl: AnyWebRenderingGLContext,
  width = 1,
  height = 1,
  depth = 1,
  widthSegments = 1,
  heightSegments = 1,
  depthSegments = 1,
  uvDefinition: CubeMeshUvDefinition = defaultCubeUvDefinition,
): GLMesh {
  // super();

  // this.type = 'BoxGeometry';

  // this.parameters = {
  // 	width: width,
  // 	height: height,
  // 	depth: depth,
  // 	widthSegments: widthSegments,
  // 	heightSegments: heightSegments,
  // 	depthSegments: depthSegments
  // };

  // const scope = this;

  // segments

  widthSegments = Math.floor(widthSegments);
  heightSegments = Math.floor(heightSegments);
  depthSegments = Math.floor(depthSegments);

  // buffers

  const indices: number[] = [];
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  // helper variables

  let numberOfVertices = 0;
  // let groupStart = 0;

  // build each side of the box geometry

  buildPlane(2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px
  buildPlane(2, 1, 0, 1, -1, depth, height, -width, depthSegments, heightSegments, 1); // nx
  buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py
  buildPlane(0, 2, 1, 1, -1, width, depth, -height, widthSegments, depthSegments, 3); // ny
  buildPlane(0, 1, 2, 1, -1, width, height, depth, widthSegments, heightSegments, 4); // pz
  buildPlane(0, 1, 2, -1, -1, width, height, -depth, widthSegments, heightSegments, 5); // nz

  // build geometry

  // this.setIndex( indices );
  // this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
  // this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
  // this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

  function buildPlane(
    u: number,
    v: number,
    w: number,
    udir: number,
    vdir: number,
    width: number,
    height: number,
    depth: number,
    gridX: number,
    gridY: number,
    faceIndex: number,
  ) {
    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const depthHalf = depth / 2;

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    let vertexCounter = 0;
    // let groupCount = 0;

    const vector = vec3.create();

    // generate vertices, normals and uvs

    const { left, right, top, bottom } = uvDefinition[faceIndex];
    const uvWidth = right - left;
    const uvHeight = top - bottom;

    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf;

      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf;

        // set values to correct vector component

        vector[u] = x * udir;
        vector[v] = y * vdir;
        vector[w] = depthHalf;

        // now apply vector to vertex buffer

        vertices.push(vector[0], vector[1], vector[2]);

        // set values to correct vector component

        vector[u] = 0;
        vector[v] = 0;
        vector[w] = depth > 0 ? 1 : -1;

        // now apply vector to normal buffer

        normals.push(vector[0], vector[1], vector[2]);

        // uvs

        uvs.push((ix / gridX) * uvWidth + left);
        uvs.push((iy / gridY) * uvHeight + bottom);

        // counters

        vertexCounter += 1;
      }
    }

    // indices

    // 1. you need three indices to draw a single face
    // 2. a single segment consists of two faces
    // 3. so we need to generate six (2*3) indices per segment

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = numberOfVertices + ix + gridX1 * iy;
        const b = numberOfVertices + ix + gridX1 * (iy + 1);
        const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
        const d = numberOfVertices + (ix + 1) + gridX1 * iy;

        // faces

        indices.push(a, b, d);
        indices.push(b, c, d);

        // increase counter

        // groupCount += 6;
      }
    }

    // add a group to the geometry. this will ensure multi material support

    // scope.addGroup( groupStart, groupCount, materialIndex );

    // calculate new start value for groups

    // groupStart += groupCount;

    // update total number of vertices

    numberOfVertices += vertexCounter;
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
