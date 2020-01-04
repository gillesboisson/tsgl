import { SceneNode } from './SceneNode';
import { structAttr, structBool, wasmObjectAttr } from '../core/decorators/StructAttribute';
import { mat4 } from 'gl-matrix';
import { wasmStruct } from '../wasm/decorators/classes';
import { DirtyFlag } from '../geom/Transform';
import { wasmFunctionOut } from '../wasm/decorators/methods';
import { SceneNodeType } from './SceneNodeType';
import { Frustrum } from '../geom/Frustrum';

const tMat: mat4 = mat4.create();

@wasmStruct({ methodsPrefix: 'Camera_' })
export class WasmCamera extends SceneNode {
  @wasmObjectAttr(Frustrum)
  protected _frustrum: Frustrum;

  // Wasm Props ------------------------------------------------------------------------------------

  @structAttr({
    type: Float32Array,
    length: 16,
  })
  protected _projectionMat: mat4;

  @structAttr({
    type: Float32Array,
    length: 16,
  })
  protected _vp: mat4;

  @structBool()
  protected _ortho: boolean;

  // Wasm Methods out ------------------------------------------------------------------------------------

  @wasmFunctionOut('initUpdateWorldMatMethod')
  private _initCamUpdateWorldMatMethod: () => void;

  // Properties ------------------------------------------------------------------------------------

  get projectionMat(): mat4 {
    return this._projectionMat;
  }

  // Methods ------------------------------------------------------------------------------------

  protected bindUpdateWorldMatMethod() {
    this._initCamUpdateWorldMatMethod();
  }

  init(firstInit?: boolean) {
    super.init(firstInit);
    this._nodeType = SceneNodeType.Camera;
  }

  perspective(fovY: number, aspect: number, near = 0.001, far = 100) {
    mat4.perspective(this._projectionMat, fovY, aspect, near, far);
    this.transform.setDirty(DirtyFlag.Frustrum);
    this._ortho = false;
    return this;
  }

  ortho(left: number, right = left, bottom = left, top = bottom, near = 0.001, far = 100) {
    mat4.ortho(this._projectionMat, left, right, bottom, top, near, far);
    this.transform.setDirty(DirtyFlag.Frustrum);
    this._ortho = true;

    return this;
  }

  sprite(width: number, height: number, near = 0.001, far = 100) {
    mat4.ortho(this._projectionMat, 0, width, height, 0, near, far);
    this.transform.setDirty(DirtyFlag.Frustrum);
    this._ortho = true;
    return this;
  }

  public mvp(modelMat: mat4, out: mat4) {
    // mat4.invert(tMat, this.worldMat);
    mat4.multiply(this._vp, this._projectionMat, this.worldMat);
    mat4.multiply(out, this._vp, modelMat);
  }

  destroy(freePtr?: boolean) {
    this._frustrum.destroy(false);
    super.destroy(freePtr);
  }
}
