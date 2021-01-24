import { GLVao } from '../../gl/core/data/GLVao';
import { AnyWebRenderingGLContext } from '../../gl/core/GLHelpers';
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
}
