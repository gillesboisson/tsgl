import { GLVao } from '../../gl/core/data/GLVao';
import { GLTFDataMesh } from './GLFTSchema';
import { GLTFCore } from './GLTFCore';
import { GLTFPrimitive } from './GLTFPrimitive';

export class GLTFMesh extends GLTFCore<GLTFDataMesh> {
  protected _name?: string;

  public get name(): string {
    return this._name;
  }

  protected _primitives: GLTFPrimitive[];
  protected _vaos: GLVao[];

  public get vaos(): GLVao[] {
    return this._vaos;
  }

  public get primitives(): GLTFPrimitive[] {
    return this._primitives;
  }

  constructor(primitives: GLTFPrimitive[], data?: GLTFDataMesh) {
    super(data);
    this._vaos = primitives.map((p) => p.vao);
    this._primitives = primitives;

    if (data) {
      this._name = data.name;
    }
  }

  destroy(destoyVaos = true): void {
    if (destoyVaos) this._vaos.forEach((vao) => vao.destroy());

    delete this._extras;
    delete this._data;
    delete this._vaos;
  }
}
