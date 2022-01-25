import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { GLBuffer } from '../../gl/core/data/GLBuffer';
import { GLAttribute } from '../../gl/core/data/GLAttribute';
import { GLDefaultAttributesLocation } from '../../gl/core/data/GLDefaultAttributesLocation';
import { GLMesh } from '../../gl/core/data/GLMesh';
import { QuadSettings } from "./QuadSettings";
import { defaultQuadSettings } from "./defaultQuadSettings";

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
    uvBottom,
    quadRight,
    quadTop,
    quadDepth,
    uvRight,
    uvBottom,
    quadLeft,
    quadBottom,
    quadDepth,
    uvLeft,
    uvTop,
    quadRight,
    quadBottom,
    quadDepth,
    uvRight,
    uvTop,
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
