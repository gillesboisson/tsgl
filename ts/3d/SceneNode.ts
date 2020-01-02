import { wasmStruct } from '../wasm/decorators/classes';
import { structAttr, wasmObjectAttr } from '../core/decorators/StructAttribute';
import { WasmTransform } from '../geom/WasmTransform';
import { WasmPoolAllocator } from '../wasm/allocators/WasmPoolAllocator';
import { WasmClassRelocatable } from '../wasm/WasmClassRelocatable';
import { WasmPtrVector } from '../wasm/WasmPtrVector';
import { SceneNodeType } from './SceneNodeType';
import { wasmFunctionOut } from '../wasm/decorators/methods';
import { mat4 } from 'gl-matrix';
@wasmStruct({ methodsPrefix: 'SceneNode_', allocator: new WasmPoolAllocator({ wasmType: WasmSceneNode }) })
export class WasmSceneNode extends WasmClassRelocatable {
  static byteLength: number;
  static allocator: WasmPoolAllocator<WasmSceneNode>;

  // Wasm Attribute Binding ==========================================
  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  protected _nodeType: SceneNodeType;

  @structAttr({
    type: Uint32Array,
    length: 1,
  })
  private _transformPtr: number;

  @structAttr({
    type: Float32Array,
    length: 16,
  })
  public worldMat: mat4;

  @structAttr({
    type: Float32Array,
    length: 6,
  })
  protected _bounds: Float32Array;

  @wasmObjectAttr(WasmPtrVector)
  _childrenPtrVector: WasmPtrVector<WasmSceneNode>;

  // Wasm Function Binding ==========================================

  @wasmFunctionOut('updateWorldMat', ['number', 'number'], null)
  wasmUpdateWorldMat: (parentMatPtr: number, parentWasDirty: boolean) => void;

  @wasmFunctionOut('test')
  test: () => void;

  // ==================================================================
  private _children: WasmSceneNode[] = [];
  private _transform: WasmTransform;

  get nodeType() {
    return this._nodeType;
  }

  init(firstInit?: boolean) {
    if (firstInit === true) {
      mat4.identity(this.worldMat);
    }

    if (this._transform === undefined) {
      this._transform = new WasmTransform(this._module);
    }
    this._transformPtr = this._transform.ptr;
    this._nodeType = SceneNodeType.Dynamic;
  }

  addChild(tr: WasmSceneNode) {
    if (this._children.indexOf(tr) === -1) {
      this._childrenPtrVector.add(tr);
      this._children.push(tr);
    }
  }

  removeChild(tr: WasmSceneNode) {
    const ind = this._children.indexOf(tr);
    if (ind !== -1) {
      this._children.splice(ind, 1);
      this._childrenPtrVector.remove(tr);
    }
  }

  get transform(): WasmTransform {
    return this._transform;
  }

  destroy(freePtr?: boolean) {
    this._childrenPtrVector.destroy(false);
    this._transform.destroy(freePtr);

    delete this._transform;
    delete this._childrenPtrVector;
    delete this._children;

    super.destroy(freePtr);
  }

  getChildren() {
    return this._children;
  }
}
