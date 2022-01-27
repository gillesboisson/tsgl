import { mat4, vec3 } from 'gl-matrix';
import { AnyWebRenderingGLContext } from '../GLHelpers';
import { IGLCore } from '../IGLCore';

const camBase = mat4.perspective(mat4.create(), Math.PI / 2, 1, 0.1, 10);

const faceOrientation = [
  vec3.fromValues(1, 0, 0),
  vec3.fromValues(-1, 0, 0),
  vec3.fromValues(0, 1, 0),
  vec3.fromValues(0, -1, 0),
  vec3.fromValues(0, 0, 1),
  vec3.fromValues(0, 0, -1),
];

const faceCams = [
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, -1, 0)),
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(-1, 0, 0), vec3.fromValues(0, -1, 0)),
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)),
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(0, -1, 0), vec3.fromValues(0, 0, -1)),
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 1), vec3.fromValues(0, -1, 0)),
  mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, -1), vec3.fromValues(0, -1, 0)),
];

faceCams.map((mat: mat4) => mat4.multiply(mat, camBase, mat));

export function renderFaces(
  gl: AnyWebRenderingGLContext,
  renderFacedelegate: (
    gl: AnyWebRenderingGLContext,
    faceTarget: GLenum,
    faceCam: mat4,
    faceOrientation: vec3,
    faceIndex: number,
  ) => void,
): void {
  for (let i = 0; i < 6; i++) {
    renderFacedelegate(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, faceCams[i], faceOrientation[i], i);
  }
}

export abstract class ACubemapRenderer<GLContext extends AnyWebRenderingGLContext = AnyWebRenderingGLContext>
implements IGLCore<GLContext> {
  constructor(readonly gl: GLContext) {}

  render(): void {
    this.bind();
    const gl = this.gl;
    for (let i = 0; i < 6; i++) {
      this.renderFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, faceCams[i], faceOrientation[i], i);
    }
    this.unbind();
  }

  protected abstract bind(): void;

  protected abstract renderFace(
    gl: AnyWebRenderingGLContext,
    faceTarget: GLenum,
    faceCam: mat4,
    faceOrientation: vec3,
    faceIndex: number,
  ): void;

  protected abstract unbind(): void;

  abstract destroy(): void;
}
