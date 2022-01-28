import { mat4 } from 'gl-matrix';
import { GLVao } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
import { Camera } from '../../utils';
import { IMaterial } from '../../utils/primitive/IMaterial';
import { GLTFDataAccessor, GLTFDataMeshPrimitive } from './GLFTSchema';
import { GLTFCore } from './GLTFCore';

export class GLTFPrimitive extends GLTFCore<GLTFDataMeshPrimitive> {
  protected _vao: GLVao;

  readonly nbIndices?: number;
  readonly nbVertices: number;
  readonly nbElements: number;

  readonly indicesType?: GLenum;

  get vao(): GLVao {
    return this._vao;
  }

  constructor(
    gl: AnyWebRenderingGLContext,
    data: GLTFDataMeshPrimitive,
    vao: GLVao,
    accessorsData: GLTFDataAccessor[],
    indicesAccessorData?: GLTFDataAccessor,
    public material?: IMaterial,
  ) {
    super(data);
    this._vao = vao;
    this.nbVertices = accessorsData[0].count;

    if (indicesAccessorData !== undefined) {
      this.nbIndices = indicesAccessorData.count;
      this.indicesType = indicesAccessorData.componentType;
      this.nbElements = this.nbIndices;
    } else {
      this.nbElements = this.nbVertices;
    }
  }

  destroy(destoyVaos = true): void {
    if (destoyVaos) this.vao.destroy();

    delete this._vao;
    delete this._data;
    delete this._extras;
  }

  render(gl: AnyWebRenderingGLContext, cam: Camera, worldMat: mat4, material = this.material): void {
    material.prepare(gl, cam, worldMat);
    material.drawVao(gl, this._vao, this.nbElements, this.indicesType);
    material.unbind(gl);
  }
}
